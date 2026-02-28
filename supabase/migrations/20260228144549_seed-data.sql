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
-- Migration: 013 — Seed Data
-- ============================================================

INSERT INTO faculty (code, name) VALUES
    ('CS',   'Faculty of Computer Science'),
    ('EECS', 'Faculty of Electrical Engineering & Communications')
ON CONFLICT (code) DO NOTHING;

INSERT INTO department (faculty_id, code, name)
SELECT f.id, 'SE', 'Software Engineering Department'
FROM faculty f WHERE f.code = 'CS'
ON CONFLICT (code) DO NOTHING;

INSERT INTO department (faculty_id, code, name)
SELECT f.id, 'IS', 'Information Systems Department'
FROM faculty f WHERE f.code = 'CS'
ON CONFLICT (code) DO NOTHING;

INSERT INTO major (department_id, code, name)
SELECT d.id, 'CS-SE', 'Software Engineering'
FROM department d WHERE d.code = 'SE'
ON CONFLICT (code) DO NOTHING;

INSERT INTO semester (name, academic_year, term, start_date, end_date, is_current)
VALUES ('Semester 2 — 2024-2025', '2024-2025', 2, '2025-01-06', '2025-06-30', TRUE)
ON CONFLICT (academic_year, term) DO NOTHING;

INSERT INTO research_area (name) VALUES
    ('AI / Machine Learning'),
    ('Web Development'),
    ('Mobile Applications'),
    ('IoT'),
    ('Blockchain'),
    ('Computer Vision'),
    ('Natural Language Processing'),
    ('Data Engineering')
ON CONFLICT (name) DO NOTHING;