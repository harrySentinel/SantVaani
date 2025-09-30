-- Create visitor_stats table for SantVaani visitor tracking
CREATE TABLE IF NOT EXISTS visitor_stats (
    id SERIAL PRIMARY KEY,
    total_visitors INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial row if table is empty
INSERT INTO visitor_stats (total_visitors)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM visitor_stats);

-- Create RLS policies for anonymous access
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read visitor stats
CREATE POLICY "Allow anonymous read access to visitor_stats" ON visitor_stats
    FOR SELECT USING (true);

-- Allow anonymous users to update visitor stats
CREATE POLICY "Allow anonymous update access to visitor_stats" ON visitor_stats
    FOR UPDATE USING (true);

-- Function to increment visitor count
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

-- Grant execute permission on function to anonymous users
GRANT EXECUTE ON FUNCTION increment_visitor_count() TO anon;