-- ============================================================
-- Migration: fix — final_score & student count trigger
-- Fixes:
--   1. final_score: proportional weighted average over available
--      scores instead of treating NULL as 0
--   2. update_topic_student_count: add DELETE branch + OR DELETE
--      on trigger so deleting an accepted registration decrements
--      current_students correctly
-- ============================================================


-- ============================================================
-- FIX 1: Recreate thesis table with corrected final_score
-- Cannot ALTER a GENERATED column directly — must drop & re-add
-- ============================================================
ALTER TABLE thesis
    DROP COLUMN IF EXISTS final_score;

ALTER TABLE thesis
    ADD COLUMN final_score NUMERIC(4,2) GENERATED ALWAYS AS (
        CASE
            WHEN supervisor_score IS NULL
             AND reviewer_score   IS NULL
             AND committee_score  IS NULL
            THEN NULL
            ELSE ROUND(
                (
                    COALESCE(supervisor_score * 0.30, 0) +
                    COALESCE(reviewer_score   * 0.30, 0) +
                    COALESCE(committee_score  * 0.40, 0)
                )
                /
                (
                    CASE WHEN supervisor_score IS NOT NULL THEN 0.30 ELSE 0 END +
                    CASE WHEN reviewer_score   IS NOT NULL THEN 0.30 ELSE 0 END +
                    CASE WHEN committee_score  IS NOT NULL THEN 0.40 ELSE 0 END
                )
            , 2)
        END
    ) STORED;


-- ============================================================
-- FIX 2: Replace trigger function + trigger with DELETE support
-- CREATE OR REPLACE is idempotent — safe to re-run
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

    ELSIF TG_OP = 'DELETE' THEN
        -- Row deleted while still 'accepted' → decrement (floor at 0)
        IF OLD.status = 'accepted' THEN
            UPDATE thesis_topic
            SET current_students = GREATEST(0, current_students - 1)
            WHERE id = OLD.thesis_topic_id;
        END IF;
        RETURN OLD;
    END IF;
END;
$$;

-- Recreate trigger to include DELETE
DROP TRIGGER IF EXISTS trg_update_topic_student_count ON topic_registration;
CREATE TRIGGER trg_update_topic_student_count
AFTER INSERT OR UPDATE OR DELETE ON topic_registration
FOR EACH ROW EXECUTE FUNCTION update_topic_student_count();