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
-- Migration: 005 — Thesis Topics
--   research_area, thesis_topic, thesis_topic_area (junction)
-- ============================================================

-- 5.1 research_area
CREATE TABLE IF NOT EXISTS research_area (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(200) NOT NULL UNIQUE,
    description TEXT
);

-- 5.2 thesis_topic
CREATE TABLE IF NOT EXISTS thesis_topic (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id         UUID           NOT NULL REFERENCES semester(id)   ON DELETE RESTRICT,
    lecturer_id         UUID           NOT NULL REFERENCES lecturer(id)   ON DELETE RESTRICT,
    code                VARCHAR(30)    NOT NULL UNIQUE,
    title               VARCHAR(500)   NOT NULL,
    title_en            VARCHAR(500),
    description         TEXT,
    prerequisites       TEXT,
    max_students        SMALLINT       NOT NULL DEFAULT 1 CHECK (max_students > 0),
    current_students    SMALLINT       NOT NULL DEFAULT 0,
    status              thesis_topic_status NOT NULL DEFAULT 'pending_approval',
    approval_notes      TEXT,
    approved_by         UUID           REFERENCES "user"(id) ON DELETE SET NULL,
    approved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_current_students CHECK (current_students <= max_students)
);
SELECT create_updated_at_trigger('thesis_topic');

CREATE INDEX IF NOT EXISTS idx_thesis_topic_semester   ON thesis_topic(semester_id);
CREATE INDEX IF NOT EXISTS idx_thesis_topic_lecturer   ON thesis_topic(lecturer_id);
CREATE INDEX IF NOT EXISTS idx_thesis_topic_status     ON thesis_topic(status);
-- Index FK approved_by — often forgotten, needed for audit/approval queries
CREATE INDEX IF NOT EXISTS idx_thesis_topic_approved_by ON thesis_topic(approved_by);


-- 5.3 thesis_topic_area (junction)
CREATE TABLE IF NOT EXISTS thesis_topic_area (
    thesis_topic_id UUID NOT NULL REFERENCES thesis_topic(id)   ON DELETE CASCADE,
    research_area_id UUID NOT NULL REFERENCES research_area(id) ON DELETE CASCADE,
    PRIMARY KEY (thesis_topic_id, research_area_id)
);