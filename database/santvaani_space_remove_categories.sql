-- Migration: Remove categories and add profile photo support
-- This transforms SantVaani Space into a personal social feed

-- Add profile_photo_url column to spiritual_posts
ALTER TABLE spiritual_posts
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Make category column nullable and set default to NULL
ALTER TABLE spiritual_posts
ALTER COLUMN category DROP NOT NULL,
ALTER COLUMN category DROP DEFAULT,
ALTER COLUMN category SET DEFAULT NULL;

-- Update existing posts to have NULL category
UPDATE spiritual_posts
SET category = NULL
WHERE category IS NOT NULL;

-- Comment explaining the changes
COMMENT ON COLUMN spiritual_posts.profile_photo_url IS 'Profile photo URL for the post author (admin)';
COMMENT ON COLUMN spiritual_posts.category IS 'Deprecated - categories removed from personal social feed';
