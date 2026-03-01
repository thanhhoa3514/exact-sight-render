
-- Enable Row Level Security
ALTER TABLE "message" ENABLE ROW LEVEL SECURITY;

-- SELECT: Allow users to view messages where they are the sender or receiver
CREATE POLICY "Users can view their own messages" 
ON "message" 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- INSERT: Allow users to insert messages only if they are the sender
CREATE POLICY "Users can send messages" 
ON "message" 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

-- UPDATE: Allow the receiver or sender to update
CREATE POLICY "Participants can update messages" 
ON "message" 
FOR UPDATE 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- DELETE: Allow the receiver or sender to delete
CREATE POLICY "Participants can delete messages" 
ON "message" 
FOR DELETE 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);