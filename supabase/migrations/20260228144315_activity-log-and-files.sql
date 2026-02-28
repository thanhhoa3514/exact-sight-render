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
-- Migration: 010 — Activity Log & File Attachments
--   activity_log, file_attachment
-- ============================================================

-- 10.1 activity_log
CREATE TABLE IF NOT EXISTS activity_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        REFERENCES "user"(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id   UUID,
    description TEXT,
    meta        JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity    ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_time ON activity_log(user_id, created_at DESC);

-- Trigger function: write activity log entries
-- SECURITY DEFINER to bypass RLS when writing to activity_log
-- RETURN OLD on DELETE
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_action    TEXT;
    v_entity_id UUID;
BEGIN
    v_action := CASE TG_OP
        WHEN 'INSERT' THEN 'created'
        WHEN 'UPDATE' THEN 'updated'
        WHEN 'DELETE' THEN 'deleted'
    END || '_' || TG_TABLE_NAME;

    v_entity_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END;

    INSERT INTO activity_log (
        user_id,
        action,
        entity_type,
        entity_id,
        meta
    )
    VALUES (
        auth.uid(),
        v_action,
        TG_TABLE_NAME,
        v_entity_id,
        CASE WHEN TG_OP = 'DELETE'
            THEN jsonb_build_object('deleted', TRUE)
            ELSE NULL
        END
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

-- Attach activity log triggers to key tables
DROP TRIGGER IF EXISTS trg_log_thesis_topic ON thesis_topic;
CREATE TRIGGER trg_log_thesis_topic
    AFTER INSERT OR UPDATE OR DELETE ON thesis_topic
    FOR EACH ROW EXECUTE FUNCTION log_activity();

DROP TRIGGER IF EXISTS trg_log_thesis ON thesis;
CREATE TRIGGER trg_log_thesis
    AFTER INSERT OR UPDATE OR DELETE ON thesis
    FOR EACH ROW EXECUTE FUNCTION log_activity();

DROP TRIGGER IF EXISTS trg_log_registration ON topic_registration;
CREATE TRIGGER trg_log_registration
    AFTER INSERT OR UPDATE OR DELETE ON topic_registration
    FOR EACH ROW EXECUTE FUNCTION log_activity();

-- 10.2 file_attachment
CREATE TABLE IF NOT EXISTS file_attachment (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name       VARCHAR(500) NOT NULL,
    url             TEXT         NOT NULL,
    file_type       VARCHAR(50)  CHECK (file_type IN ('pdf', 'docx', 'zip', 'xlsx', 'png', 'jpg')),
    file_size       BIGINT       CHECK (file_size > 0),
    uploaded_by     UUID         REFERENCES "user"(id) ON DELETE SET NULL,
    entity_type     VARCHAR(50),
    entity_id       UUID,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_file_attachment_entity   ON file_attachment(entity_type, entity_id);
-- Index FK uploaded_by — needed to filter "files I uploaded"
CREATE INDEX IF NOT EXISTS idx_file_attachment_uploader ON file_attachment(uploaded_by);