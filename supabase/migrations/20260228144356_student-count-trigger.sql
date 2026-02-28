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
-- Migration: 011 — Topic Student Count Sync Trigger
-- ============================================================
-- Keeps thesis_topic.current_students in sync with
-- topic_registration.status changes.
--
-- NOTE: Race condition is possible when two users simultaneously
-- approve the last available slot. Use SELECT ... FOR UPDATE at the
-- application layer when implementing the approval flow (Sprint 2).
-- ============================================================

CREATE OR REPLACE FUNCTION update_topic_student_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.status = 'accepted' THEN
            UPDATE thesis_topic
            SET current_students = current_students + 1
            WHERE id = NEW.thesis_topic_id;
        END IF;
        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
        -- Transitioned TO 'accepted' → increment
        IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
            UPDATE thesis_topic
            SET current_students = current_students + 1
            WHERE id = NEW.thesis_topic_id;
        END IF;
        -- Transitioned FROM 'accepted' → decrement (floor at 0)
        IF OLD.status = 'accepted' AND NEW.status != 'accepted' THEN
            UPDATE thesis_topic
            SET current_students = GREATEST(0, current_students - 1)
            WHERE id = NEW.thesis_topic_id;
        END IF;
        RETURN NEW;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_topic_student_count ON topic_registration;
CREATE TRIGGER trg_update_topic_student_count
AFTER INSERT OR UPDATE ON topic_registration
FOR EACH ROW EXECUTE FUNCTION update_topic_student_count();