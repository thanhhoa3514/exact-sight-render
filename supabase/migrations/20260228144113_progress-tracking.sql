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
-- Migration: 007 — Progress Tracking
--   progress_milestone, progress_report
-- ============================================================

-- 7.1 progress_milestone
CREATE TABLE IF NOT EXISTS progress_milestone (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id UUID         NOT NULL REFERENCES semester(id) ON DELETE CASCADE,
    name        VARCHAR(200) NOT NULL,
    order_num   SMALLINT     NOT NULL,
    deadline    DATE         NOT NULL,
    description TEXT,
    is_required BOOLEAN      NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_progress_milestone_semester ON progress_milestone(semester_id);

-- 7.2 progress_report
CREATE TABLE IF NOT EXISTS progress_report (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thesis_id           UUID           NOT NULL REFERENCES thesis(id)             ON DELETE CASCADE,
    milestone_id        UUID           NOT NULL REFERENCES progress_milestone(id) ON DELETE RESTRICT,
    file_url            TEXT,
    description         TEXT,
    status              progress_status NOT NULL DEFAULT 'not_submitted',
    submitted_at        TIMESTAMPTZ,
    supervisor_feedback TEXT,
    feedback_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    UNIQUE (thesis_id, milestone_id)
);
SELECT create_updated_at_trigger('progress_report');
CREATE INDEX IF NOT EXISTS idx_progress_report_thesis  ON progress_report(thesis_id);
CREATE INDEX IF NOT EXISTS idx_progress_report_status  ON progress_report(status);