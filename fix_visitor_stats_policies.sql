-- Safe script to handle existing policies
-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous read access to visitor_stats" ON visitor_stats;
DROP POLICY IF EXISTS "Allow anonymous update access to visitor_stats" ON visitor_stats;

-- Recreate the policies
CREATE POLICY "Allow anonymous read access to visitor_stats" ON visitor_stats
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update access to visitor_stats" ON visitor_stats
    FOR UPDATE USING (true);

-- Ensure the function exists (safe to run multiple times)
CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    UPDATE visitor_stats
    SET total_visitors = total_visitors + 1,
        updated_at = NOW()
    WHERE id = (SELECT id FROM visitor_stats ORDER BY id LIMIT 1)
    RETURNING total_visitors INTO new_count;

    IF new_count IS NULL THEN
        INSERT INTO visitor_stats (total_visitors)
        VALUES (1)
        RETURNING total_visitors INTO new_count;
    END IF;

    RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_visitor_count() TO anon;