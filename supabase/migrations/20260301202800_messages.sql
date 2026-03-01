-- ============================================================
-- Migration: 013 — Messages (Q&A)
--   message
-- ============================================================

-- 13.1 message
CREATE TABLE IF NOT EXISTS message (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id   UUID         NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    receiver_id UUID         NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    content     TEXT         NOT NULL,
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index for querying chat history between two users
CREATE INDEX IF NOT EXISTS idx_message_sender_receiver ON message(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_message_receiver_read ON message(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_message_created_at ON message(created_at DESC);

-- Trigger for updated_at (reusing the helper from previous migrations)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_updated_at_trigger') THEN
        PERFORM create_updated_at_trigger('message');
    END IF;
END $$;
