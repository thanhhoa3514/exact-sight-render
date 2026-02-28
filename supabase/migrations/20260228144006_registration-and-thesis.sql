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
-- Migration: 006 — Topic Registration & Thesis
--   topic_registration, thesis
-- ============================================================

-- 6.1 topic_registration
CREATE TABLE IF NOT EXISTS topic_registration (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thesis_topic_id UUID           NOT NULL REFERENCES thesis_topic(id) ON DELETE RESTRICT,
    student_id      UUID           NOT NULL REFERENCES student(id)      ON DELETE RESTRICT,
    priority_order  SMALLINT       CHECK (priority_order BETWEEN 1 AND 3),
    submission_order SMALLINT,
    status          registration_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    approved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, thesis_topic_id)
);
CREATE INDEX IF NOT EXISTS idx_registration_topic   ON topic_registration(thesis_topic_id);
CREATE INDEX IF NOT EXISTS idx_registration_student ON topic_registration(student_id);
CREATE INDEX IF NOT EXISTS idx_registration_status  ON topic_registration(status);

-- 6.2 thesis
CREATE TABLE IF NOT EXISTS thesis (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thesis_topic_id         UUID           NOT NULL REFERENCES thesis_topic(id)     ON DELETE RESTRICT,
    student_id              UUID           NOT NULL UNIQUE REFERENCES student(id)   ON DELETE RESTRICT,
    defense_round_id        UUID           REFERENCES defense_round(id)             ON DELETE SET NULL,
    registration_id         UUID           REFERENCES topic_registration(id)        ON DELETE SET NULL,

    -- Submission
    thesis_file_url         TEXT,
    thesis_file_version     SMALLINT       NOT NULL DEFAULT 0,
    submitted_at            TIMESTAMPTZ,

    -- Plagiarism check
    plagiarism_rate         NUMERIC(5,2)   CHECK (plagiarism_rate BETWEEN 0 AND 100),
    plagiarism_report_url   TEXT,

    -- Status & grading
    status                  defense_status NOT NULL DEFAULT 'awaiting_defense',
    notes                   TEXT,
    supervisor_score        NUMERIC(4,2)   CHECK (supervisor_score    BETWEEN 0 AND 10),
    reviewer_score          NUMERIC(4,2)   CHECK (reviewer_score      BETWEEN 0 AND 10),
    committee_score         NUMERIC(4,2)   CHECK (committee_score     BETWEEN 0 AND 10),

    -- Computed final score:
    --   NULL when no individual score exists yet (avoids showing incorrect 0.00)
    --   When at least one score is present, calculates weighted average
    final_score             NUMERIC(4,2)   GENERATED ALWAYS AS (
        CASE
            WHEN supervisor_score IS NULL
             AND reviewer_score   IS NULL
             AND committee_score  IS NULL
            THEN NULL
            ELSE ROUND(
                COALESCE(supervisor_score, 0) * 0.30 +
                COALESCE(reviewer_score,   0) * 0.30 +
                COALESCE(committee_score,  0) * 0.40
            , 2)
        END
    ) STORED,

    result                  defense_result,
    created_at              TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('thesis');

CREATE INDEX IF NOT EXISTS idx_thesis_topic        ON thesis(thesis_topic_id);
CREATE INDEX IF NOT EXISTS idx_thesis_defense_round ON thesis(defense_round_id);
CREATE INDEX IF NOT EXISTS idx_thesis_status        ON thesis(status);
-- Index FK registration_id — used to trace back to original registration
CREATE INDEX IF NOT EXISTS idx_thesis_registration  ON thesis(registration_id);

