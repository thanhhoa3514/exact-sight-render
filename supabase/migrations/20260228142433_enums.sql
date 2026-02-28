-- ============================================================
-- Migration: 002 — ENUMs
-- ============================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'lecturer', 'student');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE gender AS ENUM ('male', 'female', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE thesis_topic_status AS ENUM (
        'pending_approval',
        'approved',
        'in_progress',
        'completed',
        'rejected',
        'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE registration_status AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE defense_status AS ENUM (
        'awaiting_defense',
        'eligible',
        'not_eligible',
        'defended',
        'retake',
        'postponed'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE progress_status AS ENUM (
        'not_submitted',
        'submitted',
        'approved',
        'needs_revision'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE committee_role AS ENUM ('chair', 'reviewer', 'member', 'secretary');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE defense_result AS ENUM ('pass', 'fail', 'postponed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE calendar_event_type AS ENUM (
        'defense',
        'submission_deadline',
        'progress_deadline',
        'meeting',
        'result'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE note_color AS ENUM ('gray', 'yellow', 'blue', 'green', 'red');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;