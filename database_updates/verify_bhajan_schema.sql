-- =====================================================
-- VERIFICATION SCRIPT FOR BHAJAN ENGAGEMENT SCHEMA
-- Run this in Supabase SQL Editor to verify everything
-- =====================================================

-- 1. Check all tables exist
SELECT
  table_name,
  CASE
    WHEN table_name = 'bhajan_favorites' THEN '✅ Favorites tracking'
    WHEN table_name = 'bhajan_plays' THEN '✅ Play event tracking'
    WHEN table_name = 'bhajan_learning' THEN '✅ Learning progress'
    WHEN table_name = 'bhajan_achievements' THEN '✅ Achievements system'
  END as description
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'bhajan_%'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Check materialized view exists
SELECT
  matviewname as view_name,
  '✅ Statistics cache (performance)' as description
FROM pg_matviews
WHERE schemaname = 'public'
AND matviewname = 'bhajan_stats';

-- 3. Check indexes created
SELECT
  tablename,
  indexname,
  '✅ Performance index' as status
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename LIKE 'bhajan_%'
ORDER BY tablename, indexname;

-- 4. Check RLS policies
SELECT
  tablename,
  policyname,
  cmd as operation,
  '✅ Security policy' as status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename LIKE 'bhajan_%'
ORDER BY tablename, policyname;

-- 5. Check helper functions
SELECT
  routine_name as function_name,
  '✅ Helper function' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'get_bhajan_favorite_count',
  'is_bhajan_favorited',
  'get_user_bhajan_stats',
  'refresh_bhajan_stats',
  'update_bhajan_learning_updated_at'
)
ORDER BY routine_name;

-- 6. Test sample queries (should return 0 rows but no errors)
SELECT 'Testing bhajan_favorites...' as test, COUNT(*) as count FROM bhajan_favorites;
SELECT 'Testing bhajan_plays...' as test, COUNT(*) as count FROM bhajan_plays;
SELECT 'Testing bhajan_learning...' as test, COUNT(*) as count FROM bhajan_learning;
SELECT 'Testing bhajan_achievements...' as test, COUNT(*) as count FROM bhajan_achievements;

-- 7. Test materialized view (should work even if empty)
SELECT 'Testing bhajan_stats view...' as test, COUNT(*) as count FROM bhajan_stats;

-- 8. Test helper function (should return 0)
SELECT
  'Testing get_bhajan_favorite_count()...' as test,
  get_bhajan_favorite_count('00000000-0000-0000-0000-000000000000'::uuid) as result;

-- =====================================================
-- EXPECTED RESULTS:
-- =====================================================
-- Query 1: Should show 4 tables
-- Query 2: Should show 1 materialized view
-- Query 3: Should show ~10 indexes
-- Query 4: Should show ~10 RLS policies
-- Query 5: Should show 5 functions
-- Query 6-8: Should all return 0 (no errors)
-- =====================================================

-- If all queries run without errors, your schema is ready! ✅
