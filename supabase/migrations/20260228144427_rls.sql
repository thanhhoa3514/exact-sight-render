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
-- Migration: 012 — Row Level Security (RLS)
-- ============================================================
-- Sprint 1: permissive policy — authenticated users can read/write all tables.
--
-- Sprint 2 TODO:
--   • Replace temp policies with role-based policies per table
--   • Use (SELECT auth.uid()) instead of auth.uid() in USING clauses
--     → prevents auth.uid() being called once per row (5–10x speedup)
--   • Enable FORCE ROW LEVEL SECURITY on user-data tables
--   • Example pattern:
--       CREATE POLICY "owner_only" ON personal_note
--           USING ((SELECT auth.uid()) = user_id);
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE faculty                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE department               ENABLE ROW LEVEL SECURITY;
ALTER TABLE major                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE semester                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE defense_round            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user"                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecturer                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecturer_expertise       ENABLE ROW LEVEL SECURITY;
ALTER TABLE student                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_area            ENABLE ROW LEVEL SECURITY;
ALTER TABLE thesis_topic             ENABLE ROW LEVEL SECURITY;
ALTER TABLE thesis_topic_area        ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_registration       ENABLE ROW LEVEL SECURITY;
ALTER TABLE thesis                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_milestone       ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_report          ENABLE ROW LEVEL SECURITY;
ALTER TABLE defense_committee        ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_member         ENABLE ROW LEVEL SECURITY;
ALTER TABLE defense_schedule         ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_form              ENABLE ROW LEVEL SECURITY;
ALTER TABLE defense_minutes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_event           ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_note            ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log             ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification             ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_recipient   ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachment          ENABLE ROW LEVEL SECURITY;

-- Temporary Sprint 1 policy: all authenticated users can do everything
DO $$
DECLARE
    tbl TEXT;
    tbls TEXT[] := ARRAY[
        'faculty', 'department', 'major', 'semester', 'defense_round',
        '"user"', 'lecturer', 'lecturer_expertise', 'student',
        'research_area', 'thesis_topic', 'thesis_topic_area',
        'topic_registration', 'thesis',
        'progress_milestone', 'progress_report',
        'defense_committee', 'committee_member', 'defense_schedule',
        'review_form', 'defense_minutes',
        'calendar_event', 'personal_note', 'activity_log',
        'notification', 'notification_recipient', 'file_attachment'
    ];
BEGIN
    FOREACH tbl IN ARRAY tbls LOOP
        EXECUTE format('DROP POLICY IF EXISTS "temp_authenticated_all" ON %s', tbl);
        EXECUTE format(
            'CREATE POLICY "temp_authenticated_all" ON %s
             FOR ALL TO authenticated USING (true) WITH CHECK (true)',
            tbl
        );
    END LOOP;
END $$;