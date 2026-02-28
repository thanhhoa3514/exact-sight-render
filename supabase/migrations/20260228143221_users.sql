-- ============================================================
-- Migration: 004 — Users
--   user, lecturer, lecturer_expertise, student
-- ============================================================

-- 4.1 user
-- id references auth.users(id) — required for Supabase Auth to work correctly.
-- No DEFAULT on id; value is passed from auth.users at registration.
CREATE TABLE IF NOT EXISTS "user" (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    full_name       VARCHAR(200) NOT NULL,
    phone_number    VARCHAR(20),
    gender          gender,
    avatar_url      TEXT,
    role            user_role    NOT NULL DEFAULT 'student',
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('user');
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
CREATE INDEX IF NOT EXISTS idx_user_role  ON "user"(role);

-- Trigger: auto-create user row when a new Supabase Auth user registers
-- SECURITY DEFINER: runs as owner, bypasses RLS to write into user table
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public."user" (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;  -- idempotent: no-op if row already exists
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();

-- Trigger: sync email when user updates their email via Supabase Auth
-- Without this trigger, user.email becomes stale after an email change
CREATE OR REPLACE FUNCTION handle_auth_user_email_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only update when email actually changed, to avoid unnecessary writes
    IF NEW.email IS DISTINCT FROM OLD.email THEN
        UPDATE public."user"
        SET email      = NEW.email,
            updated_at = NOW()
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
    AFTER UPDATE OF email ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_auth_user_email_updated();

-- 4.2 lecturer
CREATE TABLE IF NOT EXISTS lecturer (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID        NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
    department_id       UUID        REFERENCES department(id) ON DELETE SET NULL,
    code                VARCHAR(20) NOT NULL UNIQUE,
    academic_rank       VARCHAR(50),
    academic_degree     VARCHAR(50),
    specialization      TEXT,
    max_supervision     SMALLINT    NOT NULL DEFAULT 5,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('lecturer');
CREATE INDEX IF NOT EXISTS idx_lecturer_department ON lecturer(department_id);

-- 4.3 lecturer_expertise
CREATE TABLE IF NOT EXISTS lecturer_expertise (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lecturer_id UUID         NOT NULL REFERENCES lecturer(id) ON DELETE CASCADE,
    tag         VARCHAR(100) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (lecturer_id, tag)
);
CREATE INDEX IF NOT EXISTS idx_expertise_lecturer ON lecturer_expertise(lecturer_id);
CREATE INDEX IF NOT EXISTS idx_expertise_tag      ON lecturer_expertise(tag);

-- 4.4 student
CREATE TABLE IF NOT EXISTS student (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID           NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
    major_id        UUID           REFERENCES major(id) ON DELETE SET NULL,
    code            VARCHAR(20)    NOT NULL UNIQUE,
    enrollment_year VARCHAR(20)    NOT NULL,
    class           VARCHAR(20),
    date_of_birth   DATE,
    cumulative_gpa  NUMERIC(4,2)   CHECK (cumulative_gpa BETWEEN 0 AND 4),
    total_credits   SMALLINT       CHECK (total_credits >= 0),
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('student');
CREATE INDEX IF NOT EXISTS idx_student_major           ON student(major_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollment_year ON student(enrollment_year);