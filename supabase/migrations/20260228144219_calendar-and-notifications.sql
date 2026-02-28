-- ============================================================
-- STANDALONE HEADER — Extensions & Helper Functions
-- Safe to run multiple times (idempotent)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "unaccent";

CREATE OR REPLACE FUNCTION f_unaccent(text)
RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT AS
$$ SELECT unaccent($1); $$;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_updated_at_trigger(table_name TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format(
        'DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I',
        table_name, table_name
    );
    EXECUTE format(
        'CREATE TRIGGER trg_%s_updated_at
         BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
        table_name, table_name
    );
END;
$$ LANGUAGE plpgsql;
-- ============================================================

-- ============================================================
-- Migration: 009 — Calendar, Notes & Notifications
--   calendar_event, personal_note, notification, notification_recipient
-- ============================================================

-- 9.1 calendar_event
CREATE TABLE IF NOT EXISTS calendar_event (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type            calendar_event_type NOT NULL,
    title           VARCHAR(300) NOT NULL,
    event_date      DATE         NOT NULL,
    start_time      TIME,
    end_time        TIME,
    entity_type     VARCHAR(50),
    entity_id       UUID,
    semester_id     UUID         REFERENCES semester(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_calendar_event_date_semester ON calendar_event(event_date, semester_id);

-- Trigger: auto-sync calendar events from defense_committee
CREATE OR REPLACE FUNCTION sync_calendar_from_committee()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO calendar_event (type, title, event_date, start_time, end_time, entity_type, entity_id)
        VALUES ('defense', 'Defense: ' || NEW.name,
                NEW.defense_date, NEW.start_time, NEW.end_time, 'defense_committee', NEW.id);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE calendar_event
        SET title       = 'Defense: ' || NEW.name,
            event_date  = NEW.defense_date,
            start_time  = NEW.start_time,
            end_time    = NEW.end_time
        WHERE entity_type = 'defense_committee' AND entity_id = NEW.id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        DELETE FROM calendar_event
        WHERE entity_type = 'defense_committee' AND entity_id = OLD.id;
        RETURN OLD;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_calendar_committee ON defense_committee;
CREATE TRIGGER trg_sync_calendar_committee
AFTER INSERT OR UPDATE OR DELETE ON defense_committee
FOR EACH ROW EXECUTE FUNCTION sync_calendar_from_committee();

-- Trigger: auto-sync calendar events from progress_milestone
CREATE OR REPLACE FUNCTION sync_calendar_from_milestone()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO calendar_event (type, title, event_date, entity_type, entity_id, semester_id)
        VALUES ('progress_deadline', 'Deadline: ' || NEW.name,
                NEW.deadline, 'progress_milestone', NEW.id, NEW.semester_id);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE calendar_event
        SET title      = 'Deadline: ' || NEW.name,
            event_date = NEW.deadline
        WHERE entity_type = 'progress_milestone' AND entity_id = NEW.id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        DELETE FROM calendar_event
        WHERE entity_type = 'progress_milestone' AND entity_id = OLD.id;
        RETURN OLD;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_calendar_milestone ON progress_milestone;
CREATE TRIGGER trg_sync_calendar_milestone
AFTER INSERT OR UPDATE OR DELETE ON progress_milestone
FOR EACH ROW EXECUTE FUNCTION sync_calendar_from_milestone();

-- 9.2 personal_note
CREATE TABLE IF NOT EXISTS personal_note (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    note_date   DATE         NOT NULL,
    content     TEXT         NOT NULL,
    color       note_color   NOT NULL DEFAULT 'gray',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('personal_note');
CREATE INDEX IF NOT EXISTS idx_personal_note_user_date ON personal_note(user_id, note_date);

-- 9.3 notification
CREATE TABLE IF NOT EXISTS notification (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(500) NOT NULL,
    content     TEXT         NOT NULL,
    type        VARCHAR(50)
                CHECK (type IN ('deadline', 'defense_schedule', 'result', 'system')),
    sender_id   UUID         REFERENCES "user"(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notification_type   ON notification(type);
CREATE INDEX IF NOT EXISTS idx_notification_time   ON notification(created_at DESC);
-- Index FK sender_id — needed to filter "notifications I sent"
CREATE INDEX IF NOT EXISTS idx_notification_sender ON notification(sender_id);

-- 9.4 notification_recipient
CREATE TABLE IF NOT EXISTS notification_recipient (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID        NOT NULL REFERENCES notification(id) ON DELETE CASCADE,
    recipient_id    UUID        NOT NULL REFERENCES "user"(id)       ON DELETE CASCADE,
    is_read         BOOLEAN     NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (notification_id, recipient_id)
);
CREATE INDEX IF NOT EXISTS idx_notification_recipient_user ON notification_recipient(recipient_id, is_read);