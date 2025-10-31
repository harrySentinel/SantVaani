-- Add is_approved column to blog_comments table
-- This column is used to moderate comments before they appear publicly

ALTER TABLE blog_comments
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT TRUE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved
ON blog_comments(is_approved);

-- Update existing comments to be approved by default
UPDATE blog_comments
SET is_approved = TRUE
WHERE is_approved IS NULL;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ is_approved column added to blog_comments table';
  RAISE NOTICE 'ℹ️  All existing comments have been marked as approved';
END $$;
