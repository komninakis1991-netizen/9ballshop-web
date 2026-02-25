-- ============================================================
-- Allow authenticated users to submit events for review.
-- Adds approved column + submitted_by + INSERT policy.
-- ============================================================

-- Add columns
ALTER TABLE events ADD COLUMN IF NOT EXISTS approved     boolean DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES profiles ON DELETE SET NULL;

-- Allow anyone to insert (event awaits admin approval)
CREATE POLICY "Events: authenticated can submit"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Update SELECT policy: public sees approved only (admins see all)
DROP POLICY IF EXISTS "Events: anyone can read" ON events;
CREATE POLICY "Events: anyone can read approved"
  ON events FOR SELECT
  USING (approved = true OR is_admin() OR auth.uid() = submitted_by);
