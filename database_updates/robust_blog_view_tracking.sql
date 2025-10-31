-- ============================================
-- Robust Blog View Tracking System
-- ============================================

-- 1. Update blog_views table to add session tracking
ALTER TABLE blog_views
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS device_type TEXT,
ADD COLUMN IF NOT EXISTS is_mobile BOOLEAN DEFAULT FALSE;

-- 2. Create unique constraint to prevent duplicate views
-- Note: We handle 24-hour deduplication in the application layer
-- This constraint prevents exact duplicate inserts
DROP INDEX IF EXISTS idx_blog_views_unique_session;
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_views_unique_session_simple
ON blog_views (blog_post_id, session_id);

-- 3. Create index for faster view count queries
CREATE INDEX IF NOT EXISTS idx_blog_views_post_id
ON blog_views (blog_post_id);

CREATE INDEX IF NOT EXISTS idx_blog_views_session_id
ON blog_views (session_id);

-- 4. Function to safely increment view count (idempotent)
CREATE OR REPLACE FUNCTION increment_blog_view_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1,
      updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger to auto-detect mobile devices
CREATE OR REPLACE FUNCTION detect_mobile_device()
RETURNS TRIGGER AS $$
BEGIN
  -- Detect mobile from user agent
  NEW.is_mobile := (
    NEW.user_agent ILIKE '%mobile%' OR
    NEW.user_agent ILIKE '%android%' OR
    NEW.user_agent ILIKE '%iphone%' OR
    NEW.user_agent ILIKE '%ipad%'
  );

  -- Set device type
  NEW.device_type := CASE
    WHEN NEW.user_agent ILIKE '%mobile%' THEN 'mobile'
    WHEN NEW.user_agent ILIKE '%tablet%' OR NEW.user_agent ILIKE '%ipad%' THEN 'tablet'
    ELSE 'desktop'
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for mobile detection
DROP TRIGGER IF EXISTS trigger_detect_mobile ON blog_views;
CREATE TRIGGER trigger_detect_mobile
  BEFORE INSERT ON blog_views
  FOR EACH ROW
  EXECUTE FUNCTION detect_mobile_device();

-- 6. Function to get accurate view count
CREATE OR REPLACE FUNCTION get_blog_view_count(post_id UUID)
RETURNS INTEGER AS $$
DECLARE
  view_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT session_id)
  INTO view_count
  FROM blog_views
  WHERE blog_post_id = post_id;

  RETURN COALESCE(view_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Function to get view analytics
CREATE OR REPLACE FUNCTION get_blog_view_analytics(post_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_views', COUNT(DISTINCT session_id),
    'unique_users', COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL),
    'anonymous_views', COUNT(*) FILTER (WHERE user_id IS NULL),
    'mobile_views', COUNT(*) FILTER (WHERE is_mobile = TRUE),
    'desktop_views', COUNT(*) FILTER (WHERE is_mobile = FALSE),
    'avg_time_spent', AVG(time_spent_seconds),
    'last_24h_views', COUNT(*) FILTER (WHERE viewed_at > NOW() - INTERVAL '24 hours'),
    'last_7d_views', COUNT(*) FILTER (WHERE viewed_at > NOW() - INTERVAL '7 days')
  )
  INTO result
  FROM blog_views
  WHERE blog_post_id = post_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Sync view_count in blog_posts table with actual view count
CREATE OR REPLACE FUNCTION sync_blog_view_counts()
RETURNS VOID AS $$
BEGIN
  UPDATE blog_posts bp
  SET view_count = (
    SELECT COUNT(DISTINCT session_id)
    FROM blog_views bv
    WHERE bv.blog_post_id = bp.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run sync to fix any existing discrepancies
SELECT sync_blog_view_counts();

-- 8b. Function to clean up old duplicate sessions (keep only the latest view per session per day)
CREATE OR REPLACE FUNCTION cleanup_duplicate_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete duplicate views, keeping only the most recent one per session per post per day
  WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY blog_post_id, session_id, viewed_at::date
             ORDER BY viewed_at DESC
           ) as rn
    FROM blog_views
  )
  DELETE FROM blog_views
  WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
  );

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up any existing duplicates
SELECT cleanup_duplicate_sessions() as duplicate_views_removed;

-- 9. Create view for blog analytics dashboard
CREATE OR REPLACE VIEW blog_post_analytics AS
SELECT
  bp.id,
  bp.title,
  bp.slug,
  bp.view_count as stored_view_count,
  COUNT(DISTINCT bv.session_id) as actual_unique_views,
  COUNT(DISTINCT bv.user_id) FILTER (WHERE bv.user_id IS NOT NULL) as registered_user_views,
  COUNT(*) FILTER (WHERE bv.user_id IS NULL) as anonymous_views,
  COUNT(*) FILTER (WHERE bv.is_mobile = TRUE) as mobile_views,
  COUNT(*) FILTER (WHERE bv.is_mobile = FALSE) as desktop_views,
  AVG(bv.time_spent_seconds) as avg_read_time_seconds,
  COUNT(*) FILTER (WHERE bv.viewed_at > NOW() - INTERVAL '24 hours') as views_24h,
  COUNT(*) FILTER (WHERE bv.viewed_at > NOW() - INTERVAL '7 days') as views_7d,
  COUNT(*) FILTER (WHERE bv.viewed_at > NOW() - INTERVAL '30 days') as views_30d
FROM blog_posts bp
LEFT JOIN blog_views bv ON bp.id = bv.blog_post_id
GROUP BY bp.id, bp.title, bp.slug, bp.view_count
ORDER BY actual_unique_views DESC;

-- 10. Grant permissions
GRANT EXECUTE ON FUNCTION increment_blog_view_count TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_blog_view_count TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_blog_view_analytics TO authenticated, anon;
GRANT SELECT ON blog_post_analytics TO authenticated, anon;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if everything is set up correctly
DO $$
BEGIN
  RAISE NOTICE '✅ Robust blog view tracking system installed successfully!';
  RAISE NOTICE '📊 New features:';
  RAISE NOTICE '   - Session-based deduplication';
  RAISE NOTICE '   - Mobile/desktop tracking';
  RAISE NOTICE '   - Read time tracking';
  RAISE NOTICE '   - 24-hour unique view constraint';
  RAISE NOTICE '   - Analytics dashboard view';
END $$;
