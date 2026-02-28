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
-- Migration: 008 — Defense Committee
--   defense_committee, committee_member,
--   defense_schedule, review_form, defense_minutes
-- ============================================================

-- 8.1 defense_committee
CREATE TABLE IF NOT EXISTS defense_committee (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    defense_round_id UUID        NOT NULL REFERENCES defense_round(id) ON DELETE RESTRICT,
    code            VARCHAR(20)  UNIQUE,
    name            VARCHAR(200) NOT NULL,
    room            VARCHAR(50),
    room_address    VARCHAR(200),
    defense_date    DATE         NOT NULL,
    start_time      TIME         NOT NULL,
    end_time        TIME         NOT NULL CHECK (end_time > start_time),
    status          VARCHAR(30)  NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    notes           TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('defense_committee');
CREATE INDEX IF NOT EXISTS idx_defense_committee_round ON defense_committee(defense_round_id);
CREATE INDEX IF NOT EXISTS idx_defense_committee_date  ON defense_committee(defense_date);

-- 8.2 committee_member
CREATE TABLE IF NOT EXISTS committee_member (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_id        UUID           NOT NULL REFERENCES defense_committee(id) ON DELETE CASCADE,
    lecturer_id         UUID           NOT NULL REFERENCES lecturer(id)          ON DELETE RESTRICT,
    role                committee_role NOT NULL,
    UNIQUE (committee_id, lecturer_id)
);
CREATE INDEX IF NOT EXISTS idx_committee_member_committee ON committee_member(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_member_lecturer  ON committee_member(lecturer_id);

-- 8.3 defense_schedule
-- UNIQUE (committee_id, order_num): prevents two students sharing the same
-- presentation slot within a committee
CREATE TABLE IF NOT EXISTS defense_schedule (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_id    UUID        NOT NULL REFERENCES defense_committee(id) ON DELETE CASCADE,
    thesis_id       UUID        NOT NULL REFERENCES thesis(id)            ON DELETE RESTRICT,
    order_num       SMALLINT    NOT NULL,
    start_time      TIME,
    status          VARCHAR(20) NOT NULL DEFAULT 'waiting'
                    CHECK (status IN ('waiting', 'in_progress', 'completed')),
    UNIQUE (committee_id, thesis_id),
    UNIQUE (committee_id, order_num)   -- prevents duplicate slot numbers
);
CREATE INDEX IF NOT EXISTS idx_defense_schedule_committee ON defense_schedule(committee_id);
CREATE INDEX IF NOT EXISTS idx_defense_schedule_thesis    ON defense_schedule(thesis_id);

-- 8.4 review_form
CREATE TABLE IF NOT EXISTS review_form (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thesis_id       UUID           NOT NULL REFERENCES thesis(id)    ON DELETE CASCADE,
    lecturer_id     UUID           NOT NULL REFERENCES lecturer(id)  ON DELETE RESTRICT,
    type            VARCHAR(20)    NOT NULL
                    CHECK (type IN ('supervisor', 'reviewer', 'committee')),
    score           NUMERIC(4,2)   CHECK (score BETWEEN 0 AND 10),
    comments        TEXT,
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    UNIQUE (thesis_id, lecturer_id, type)
);
SELECT create_updated_at_trigger('review_form');
CREATE INDEX IF NOT EXISTS idx_review_form_thesis   ON review_form(thesis_id);
CREATE INDEX IF NOT EXISTS idx_review_form_lecturer ON review_form(lecturer_id);

-- 8.5 defense_minutes
CREATE TABLE IF NOT EXISTS defense_minutes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_id    UUID        NOT NULL REFERENCES defense_committee(id) ON DELETE CASCADE,
    file_url        TEXT,
    is_signed       BOOLEAN     NOT NULL DEFAULT FALSE,
    signed_at       TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('defense_minutes');
-- Index FK committee_id — needed for JOIN/lookup
CREATE INDEX IF NOT EXISTS idx_defense_minutes_committee ON defense_minutes(committee_id);