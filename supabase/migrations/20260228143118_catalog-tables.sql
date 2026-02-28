-- ============================================================
-- Migration: 003 — Base Catalog Tables
--   faculty, department, major, semester, defense_round
-- ============================================================

-- 3.1 faculty
CREATE TABLE IF NOT EXISTS faculty (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(20)  NOT NULL UNIQUE,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('faculty');

-- 3.2 department
CREATE TABLE IF NOT EXISTS department (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id  UUID         NOT NULL REFERENCES faculty(id) ON DELETE RESTRICT,
    code        VARCHAR(20)  NOT NULL UNIQUE,
    name        VARCHAR(200) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('department');
CREATE INDEX IF NOT EXISTS idx_department_faculty ON department(faculty_id);

-- 3.3 major
CREATE TABLE IF NOT EXISTS major (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID         REFERENCES department(id) ON DELETE SET NULL,
    code          VARCHAR(20)  NOT NULL UNIQUE,
    name          VARCHAR(200) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('major');
CREATE INDEX IF NOT EXISTS idx_major_department ON major(department_id);

-- 3.4 semester
CREATE TABLE IF NOT EXISTS semester (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50)  NOT NULL,
    academic_year   VARCHAR(20)  NOT NULL,
    term            SMALLINT     NOT NULL CHECK (term IN (1, 2, 3)),
    start_date      DATE         NOT NULL,
    end_date        DATE         NOT NULL CHECK (end_date > start_date),
    is_current      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (academic_year, term)
);

-- Partial unique index: only one semester can be "current"
CREATE UNIQUE INDEX IF NOT EXISTS idx_semester_is_current_unique
    ON semester (is_current)
    WHERE is_current = TRUE;

-- Trigger: when a semester is set as current, auto-reset all others to FALSE
CREATE OR REPLACE FUNCTION ensure_single_current_semester()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    IF NEW.is_current = TRUE THEN
        UPDATE semester
        SET is_current = FALSE
        WHERE is_current = TRUE
          AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_semester_single_current ON semester;
CREATE TRIGGER trg_semester_single_current
    BEFORE INSERT OR UPDATE OF is_current ON semester
    FOR EACH ROW EXECUTE FUNCTION ensure_single_current_semester();

-- 3.5 defense_round
CREATE TABLE IF NOT EXISTS defense_round (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id     UUID         NOT NULL REFERENCES semester(id) ON DELETE RESTRICT,
    name            VARCHAR(100) NOT NULL,
    start_date      DATE         NOT NULL,
    end_date        DATE         NOT NULL CHECK (end_date >= start_date),
    submission_deadline DATE,
    description     TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('defense_round');
CREATE INDEX IF NOT EXISTS idx_defense_round_semester ON defense_round(semester_id);