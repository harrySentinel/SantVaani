-- Naam Jap Tracker Database Schema
-- This table stores daily naam jap (spiritual chanting) entries for users

-- Drop existing table if you need to reset (use with caution!)
-- DROP TABLE IF EXISTS naam_jap_entries CASCADE;

-- Create naam_jap_entries table
CREATE TABLE IF NOT EXISTS naam_jap_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to authenticated user (optional)
  date DATE NOT NULL, -- The date of the entry
  count INTEGER NOT NULL CHECK (count >= 0), -- Number of naam japs done (must be non-negative)
  notes TEXT, -- Optional notes about the practice (feelings, insights)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Ensure one entry per user per day
  CONSTRAINT unique_user_date UNIQUE(user_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_naam_jap_user_id ON naam_jap_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_naam_jap_date ON naam_jap_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_naam_jap_user_date ON naam_jap_entries(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_naam_jap_created_at ON naam_jap_entries(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_naam_jap_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to naam_jap_entries table
DROP TRIGGER IF EXISTS naam_jap_updated_at_trigger ON naam_jap_entries;
CREATE TRIGGER naam_jap_updated_at_trigger
  BEFORE UPDATE ON naam_jap_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_naam_jap_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE naam_jap_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- 1. Users can view only their own entries
CREATE POLICY "Users can view their own naam jap entries"
  ON naam_jap_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Users can insert their own entries
CREATE POLICY "Users can insert their own naam jap entries"
  ON naam_jap_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Users can update only their own entries
CREATE POLICY "Users can update their own naam jap entries"
  ON naam_jap_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete only their own entries
CREATE POLICY "Users can delete their own naam jap entries"
  ON naam_jap_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Optional: For testing/development - allow public access without auth
-- IMPORTANT: Remove these policies in production if you require authentication!
-- CREATE POLICY "Allow public read access for testing"
--   ON naam_jap_entries
--   FOR SELECT
--   USING (true);

-- CREATE POLICY "Allow public insert for testing"
--   ON naam_jap_entries
--   FOR INSERT
--   WITH CHECK (true);

-- CREATE POLICY "Allow public update for testing"
--   ON naam_jap_entries
--   FOR UPDATE
--   USING (true)
--   WITH CHECK (true);

-- CREATE POLICY "Allow public delete for testing"
--   ON naam_jap_entries
--   FOR DELETE
--   USING (true);

-- Helper function: Get user's total count
CREATE OR REPLACE FUNCTION get_user_total_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(count) FROM naam_jap_entries WHERE user_id = p_user_id),
    0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Get user's current streak
CREATE OR REPLACE FUNCTION get_user_current_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_has_entry BOOLEAN;
BEGIN
  LOOP
    -- Check if there's an entry for current date
    SELECT EXISTS(
      SELECT 1 FROM naam_jap_entries
      WHERE user_id = p_user_id AND date = v_current_date
    ) INTO v_has_entry;

    -- If no entry found, break the loop
    IF NOT v_has_entry THEN
      EXIT;
    END IF;

    -- Increment streak and move to previous day
    v_streak := v_streak + 1;
    v_current_date := v_current_date - INTERVAL '1 day';
  END LOOP;

  RETURN v_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Get user's longest streak
CREATE OR REPLACE FUNCTION get_user_longest_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_max_streak INTEGER := 0;
  v_current_streak INTEGER := 0;
  v_prev_date DATE := NULL;
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT date
    FROM naam_jap_entries
    WHERE user_id = p_user_id
    ORDER BY date ASC
  LOOP
    IF v_prev_date IS NULL OR rec.date = v_prev_date + INTERVAL '1 day' THEN
      v_current_streak := v_current_streak + 1;
    ELSE
      v_max_streak := GREATEST(v_max_streak, v_current_streak);
      v_current_streak := 1;
    END IF;

    v_prev_date := rec.date;
  END LOOP;

  v_max_streak := GREATEST(v_max_streak, v_current_streak);
  RETURN v_max_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE naam_jap_entries IS 'Stores daily naam jap (spiritual chanting) practice entries for users';
COMMENT ON COLUMN naam_jap_entries.id IS 'Unique identifier for each entry';
COMMENT ON COLUMN naam_jap_entries.user_id IS 'Reference to the user who made this entry';
COMMENT ON COLUMN naam_jap_entries.date IS 'The date when the naam jap was performed';
COMMENT ON COLUMN naam_jap_entries.count IS 'Number of naam japs/mantras chanted';
COMMENT ON COLUMN naam_jap_entries.notes IS 'Optional notes about the practice session';
COMMENT ON COLUMN naam_jap_entries.created_at IS 'Timestamp when the entry was created';
COMMENT ON COLUMN naam_jap_entries.updated_at IS 'Timestamp when the entry was last updated';

-- Sample data for testing (optional - remove in production)
-- INSERT INTO naam_jap_entries (user_id, date, count, notes) VALUES
--   (auth.uid(), CURRENT_DATE, 1080, 'Morning session - very peaceful'),
--   (auth.uid(), CURRENT_DATE - INTERVAL '1 day', 2160, 'Did 2 malas today!'),
--   (auth.uid(), CURRENT_DATE - INTERVAL '2 days', 1080, '');

-- Grant necessary permissions (adjust based on your auth setup)
-- GRANT ALL ON naam_jap_entries TO authenticated;
-- GRANT ALL ON naam_jap_entries TO service_role;
