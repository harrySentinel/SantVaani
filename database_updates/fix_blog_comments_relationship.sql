-- ============================================
-- Fix Blog Comments Relationship with User Profiles
-- ============================================

-- The issue: Supabase can't find the relationship between blog_comments and user_profiles
-- Solution: Create a proper foreign key relationship

-- 1. First, check if the foreign key exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'blog_comments_user_id_fkey'
  ) THEN
    -- Add foreign key constraint if it doesn't exist
    ALTER TABLE blog_comments
    ADD CONSTRAINT blog_comments_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

    RAISE NOTICE '✅ Added foreign key constraint: blog_comments -> auth.users';
  ELSE
    RAISE NOTICE 'ℹ️ Foreign key constraint already exists';
  END IF;
END $$;

-- 2. Ensure user_profiles table has proper foreign key to auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_profiles_id_fkey'
  ) THEN
    ALTER TABLE user_profiles
    ADD CONSTRAINT user_profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

    RAISE NOTICE '✅ Added foreign key constraint: user_profiles -> auth.users';
  ELSE
    RAISE NOTICE 'ℹ️ Foreign key constraint already exists';
  END IF;
END $$;

-- 3. Create indexes for better join performance
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);

-- 4. Grant necessary permissions
GRANT SELECT ON user_profiles TO anon, authenticated;
GRANT SELECT ON blog_comments TO anon, authenticated;

-- 5. Verify the relationships
DO $$
DECLARE
  comment_fk_exists BOOLEAN;
  profile_fk_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'blog_comments_user_id_fkey'
  ) INTO comment_fk_exists;

  SELECT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_profiles_id_fkey'
  ) INTO profile_fk_exists;

  IF comment_fk_exists AND profile_fk_exists THEN
    RAISE NOTICE '✅ All foreign key relationships are properly configured!';
  ELSE
    RAISE NOTICE '⚠️ Some foreign keys might be missing. Please check manually.';
  END IF;
END $$;

-- 6. Refresh Supabase schema cache (this forces Supabase to recognize the relationships)
NOTIFY pgrst, 'reload schema';

RAISE NOTICE '🔄 Schema cache refresh triggered. The relationship should now be visible.';
