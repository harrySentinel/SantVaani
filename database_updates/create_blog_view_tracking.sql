-- Create table for IP-based blog view tracking
-- This replaces the localStorage-based approach with a more reliable server-side solution

CREATE TABLE IF NOT EXISTS blog_view_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  ip_address VARCHAR(45) NOT NULL, -- Supports both IPv4 and IPv6
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Composite unique index to prevent duplicate views from same IP within cooldown period
  -- The partial index only applies to views from the last 24 hours
  CONSTRAINT unique_view_per_day UNIQUE (post_id, ip_address, viewed_at)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_view_tracking_post_id ON blog_view_tracking(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_view_tracking_ip ON blog_view_tracking(ip_address);
CREATE INDEX IF NOT EXISTS idx_blog_view_tracking_viewed_at ON blog_view_tracking(viewed_at);

-- Function to check if an IP has viewed a post in the last 24 hours
CREATE OR REPLACE FUNCTION has_recent_view(p_post_id UUID, p_ip_address VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM blog_view_tracking
    WHERE post_id = p_post_id
      AND ip_address = p_ip_address
      AND viewed_at > NOW() - INTERVAL '24 hours'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to safely track a blog view with IP-based deduplication
CREATE OR REPLACE FUNCTION track_blog_view(
  p_post_id UUID,
  p_ip_address VARCHAR,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_has_recent_view BOOLEAN;
  v_view_id UUID;
BEGIN
  -- Check if this IP has viewed this post in the last 24 hours
  v_has_recent_view := has_recent_view(p_post_id, p_ip_address);

  IF NOT v_has_recent_view THEN
    -- Insert new view record
    INSERT INTO blog_view_tracking (post_id, ip_address, user_agent)
    VALUES (p_post_id, p_ip_address, p_user_agent)
    RETURNING id INTO v_view_id;

    -- Increment the view count on the blog post
    UPDATE blog_posts
    SET view_count = view_count + 1
    WHERE id = p_post_id;

    RETURN json_build_object(
      'success', true,
      'view_recorded', true,
      'view_id', v_view_id,
      'message', 'View counted successfully'
    );
  ELSE
    RETURN json_build_object(
      'success', true,
      'view_recorded', false,
      'message', 'View already counted in the last 24 hours'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Cleanup old view records (optional - run periodically to save storage)
-- Keeps last 30 days of data for analytics
CREATE OR REPLACE FUNCTION cleanup_old_view_tracking()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM blog_view_tracking
  WHERE viewed_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comment for documentation
COMMENT ON TABLE blog_view_tracking IS 'Tracks blog post views with IP-based deduplication (24-hour cooldown)';
COMMENT ON FUNCTION track_blog_view IS 'Safely tracks a blog view with automatic deduplication based on IP address and 24-hour cooldown';
COMMENT ON FUNCTION cleanup_old_view_tracking IS 'Removes view tracking records older than 30 days';
