-- Add language column to blog_posts table
-- This allows bilingual content (Hindi + English)

-- Add language column
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'hi';

-- Add comment for documentation
COMMENT ON COLUMN blog_posts.language IS 'Content language: hi (Hindi) or en (English)';

-- Create index for faster language filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON blog_posts(language);

-- Update existing posts to Hindi (default)
UPDATE blog_posts
SET language = 'hi'
WHERE language IS NULL;

-- Verify the change
SELECT COUNT(*) as total_posts, language
FROM blog_posts
GROUP BY language;
