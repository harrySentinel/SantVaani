-- =====================================================
-- SantVaani Bhajan Engagement Schema
-- Created: 2025-12-11
-- Purpose: Add interactive features to bhajans
-- =====================================================

-- =====================================================
-- 1. BHAJAN FAVORITES
-- Track which bhajans users have favorited
-- =====================================================

CREATE TABLE IF NOT EXISTS bhajan_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bhajan_id UUID NOT NULL REFERENCES bhajans(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, bhajan_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bhajan_favorites_user_id ON bhajan_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_bhajan_favorites_bhajan_id ON bhajan_favorites(bhajan_id);
CREATE INDEX IF NOT EXISTS idx_bhajan_favorites_created_at ON bhajan_favorites(created_at);

-- RLS Policies for bhajan_favorites
ALTER TABLE bhajan_favorites ENABLE ROW LEVEL SECURITY;

-- Users can view all favorites (for counts)
CREATE POLICY "Anyone can view favorites" ON bhajan_favorites
  FOR SELECT USING (true);

-- Users can only insert their own favorites
CREATE POLICY "Users can insert own favorites" ON bhajan_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own favorites
CREATE POLICY "Users can delete own favorites" ON bhajan_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 2. BHAJAN PLAYS
-- Track when users play/listen to bhajans
-- =====================================================

CREATE TABLE IF NOT EXISTS bhajan_plays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bhajan_id UUID NOT NULL REFERENCES bhajans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Allow anonymous plays
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_seconds INTEGER, -- How long they listened
  completed BOOLEAN DEFAULT false, -- Did they listen to completion?
  source VARCHAR(50) DEFAULT 'web' -- web, mobile, etc.
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bhajan_plays_bhajan_id ON bhajan_plays(bhajan_id);
CREATE INDEX IF NOT EXISTS idx_bhajan_plays_user_id ON bhajan_plays(user_id);
CREATE INDEX IF NOT EXISTS idx_bhajan_plays_played_at ON bhajan_plays(played_at);
CREATE INDEX IF NOT EXISTS idx_bhajan_plays_completed ON bhajan_plays(completed);

-- RLS Policies for bhajan_plays
ALTER TABLE bhajan_plays ENABLE ROW LEVEL SECURITY;

-- Anyone can view play stats (for trending/popular)
CREATE POLICY "Anyone can view plays" ON bhajan_plays
  FOR SELECT USING (true);

-- Anyone can insert plays (including anonymous users)
CREATE POLICY "Anyone can insert plays" ON bhajan_plays
  FOR INSERT WITH CHECK (true);

-- Only users can update their own plays
CREATE POLICY "Users can update own plays" ON bhajan_plays
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 3. MATERIALIZED VIEW FOR BHAJAN STATS
-- Pre-computed statistics for better performance
-- =====================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS bhajan_stats AS
SELECT
  bhajan_id,
  COUNT(*) as total_plays,
  COUNT(DISTINCT user_id) as unique_listeners,
  COUNT(CASE WHEN played_at > NOW() - INTERVAL '7 days' THEN 1 END) as plays_this_week,
  COUNT(CASE WHEN played_at > NOW() - INTERVAL '30 days' THEN 1 END) as plays_this_month,
  COUNT(CASE WHEN completed = true THEN 1 END) as completed_plays,
  AVG(duration_seconds) as avg_duration_seconds,
  MAX(played_at) as last_played_at
FROM bhajan_plays
GROUP BY bhajan_id;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_bhajan_stats_bhajan_id ON bhajan_stats(bhajan_id);
CREATE INDEX IF NOT EXISTS idx_bhajan_stats_plays_week ON bhajan_stats(plays_this_week DESC);
CREATE INDEX IF NOT EXISTS idx_bhajan_stats_total_plays ON bhajan_stats(total_plays DESC);

-- =====================================================
-- 4. BHAJAN LEARNING PROGRESS
-- Track users' progress in learning/memorizing bhajans
-- =====================================================

CREATE TABLE IF NOT EXISTS bhajan_learning (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bhajan_id UUID NOT NULL REFERENCES bhajans(id) ON DELETE CASCADE,
  memorization_level INTEGER DEFAULT 0 CHECK (memorization_level >= 0 AND memorization_level <= 100), -- 0-100%
  practice_count INTEGER DEFAULT 0, -- How many times practiced
  last_practiced_at TIMESTAMP WITH TIME ZONE,
  mastered BOOLEAN DEFAULT false, -- Marked as fully learned
  notes TEXT, -- Personal notes about the bhajan
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, bhajan_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_bhajan_learning_user_id ON bhajan_learning(user_id);
CREATE INDEX IF NOT EXISTS idx_bhajan_learning_bhajan_id ON bhajan_learning(bhajan_id);
CREATE INDEX IF NOT EXISTS idx_bhajan_learning_mastered ON bhajan_learning(mastered);

-- RLS Policies for bhajan_learning
ALTER TABLE bhajan_learning ENABLE ROW LEVEL SECURITY;

-- Users can only view their own learning progress
CREATE POLICY "Users can view own learning" ON bhajan_learning
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own learning progress
CREATE POLICY "Users can insert own learning" ON bhajan_learning
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own learning progress
CREATE POLICY "Users can update own learning" ON bhajan_learning
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own learning progress
CREATE POLICY "Users can delete own learning" ON bhajan_learning
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bhajan_learning_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bhajan_learning_updated_at
  BEFORE UPDATE ON bhajan_learning
  FOR EACH ROW
  EXECUTE FUNCTION update_bhajan_learning_updated_at();

-- =====================================================
-- 5. BHAJAN ACHIEVEMENTS
-- Track user achievements related to bhajans
-- =====================================================

CREATE TABLE IF NOT EXISTS bhajan_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL, -- 'first_favorite', 'hanuman_devotee', '10_bhajans_learned', etc.
  achievement_data JSONB, -- Additional metadata
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_bhajan_achievements_user_id ON bhajan_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_bhajan_achievements_type ON bhajan_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_bhajan_achievements_earned_at ON bhajan_achievements(earned_at);

-- Prevent duplicate achievements
CREATE UNIQUE INDEX IF NOT EXISTS idx_bhajan_achievements_unique
  ON bhajan_achievements(user_id, achievement_type);

-- RLS Policies for bhajan_achievements
ALTER TABLE bhajan_achievements ENABLE ROW LEVEL SECURITY;

-- Users can view all achievements (for leaderboards)
CREATE POLICY "Anyone can view achievements" ON bhajan_achievements
  FOR SELECT USING (true);

-- Only system can insert achievements (via backend API)
CREATE POLICY "Authenticated users can insert achievements" ON bhajan_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 6. HELPER FUNCTIONS
-- Useful database functions for bhajan features
-- =====================================================

-- Function to get favorite count for a bhajan
CREATE OR REPLACE FUNCTION get_bhajan_favorite_count(bhajan_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM bhajan_favorites WHERE bhajan_id = bhajan_uuid);
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has favorited a bhajan
CREATE OR REPLACE FUNCTION is_bhajan_favorited(bhajan_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM bhajan_favorites
    WHERE bhajan_id = bhajan_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get user's bhajan stats
CREATE OR REPLACE FUNCTION get_user_bhajan_stats(user_uuid UUID)
RETURNS TABLE(
  total_favorites INTEGER,
  total_plays INTEGER,
  bhajans_mastered INTEGER,
  total_practice_sessions INTEGER,
  achievements_earned INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM bhajan_favorites WHERE user_id = user_uuid),
    (SELECT COUNT(*)::INTEGER FROM bhajan_plays WHERE user_id = user_uuid),
    (SELECT COUNT(*)::INTEGER FROM bhajan_learning WHERE user_id = user_uuid AND mastered = true),
    (SELECT COALESCE(SUM(practice_count), 0)::INTEGER FROM bhajan_learning WHERE user_id = user_uuid),
    (SELECT COUNT(*)::INTEGER FROM bhajan_achievements WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. REFRESH MATERIALIZED VIEW FUNCTION
-- Call this daily via cron or manually when needed
-- =====================================================

CREATE OR REPLACE FUNCTION refresh_bhajan_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY bhajan_stats;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VERIFICATION QUERIES
-- Run these after migration to verify everything works
-- =====================================================

-- Check that all tables exist
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name LIKE 'bhajan_%';

-- Check indexes
-- SELECT indexname FROM pg_indexes
-- WHERE tablename LIKE 'bhajan_%';

-- Check RLS policies
-- SELECT tablename, policyname, cmd, qual
-- FROM pg_policies
-- WHERE tablename LIKE 'bhajan_%';

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment to add test data
/*
-- Add a test favorite (replace UUIDs with actual values)
-- INSERT INTO bhajan_favorites (user_id, bhajan_id)
-- VALUES ('your-user-uuid', 'your-bhajan-uuid');

-- Add a test play
-- INSERT INTO bhajan_plays (bhajan_id, user_id, duration_seconds, completed)
-- VALUES ('your-bhajan-uuid', 'your-user-uuid', 120, true);

-- Refresh stats
-- SELECT refresh_bhajan_stats();
*/

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify tables created: SELECT * FROM bhajan_favorites LIMIT 1;
-- 3. Test RLS policies by querying as authenticated user
-- 4. Refresh materialized view: SELECT refresh_bhajan_stats();
-- =====================================================
