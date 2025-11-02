# Blog View Tracking Migration Guide

## Overview
This migration implements IP-based server-side view tracking to replace the localStorage approach. This provides:
- **Cross-device consistency**: Views tracked on the server, not in browser storage
- **24-hour cooldown**: Same IP can't increment view count for 24 hours
- **Reliability**: Not affected by clearing browser data
- **Better analytics**: Store view data with IP and user agent for insights

## Files Changed

### Backend
- `backend/server.js`: Added `/api/blog/track-view` endpoint for IP-based tracking
- Removed automatic view increment from `/api/blog/posts/:slug` endpoint

### Frontend
- `frontend/src/pages/blog/index.tsx`: Changed limit from 3 to 100 to show all blogs
- `frontend/src/hooks/useServerBlogView.ts`: New hook for server-side view tracking
- `frontend/src/pages/blog/post/[slug].tsx`: Updated to use new tracking hook

### Database
- `database_updates/create_blog_view_tracking.sql`: New table and functions for view tracking

## How to Apply the Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. **Login to Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your `santvaani` project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the entire content of `create_blog_view_tracking.sql`
   - Paste it into the SQL editor
   - Click "Run" or press Ctrl+Enter
   - Verify that all statements executed successfully

4. **Verify the Migration**
   ```sql
   -- Check if table was created
   SELECT * FROM blog_view_tracking LIMIT 1;

   -- Check if function exists
   SELECT proname FROM pg_proc WHERE proname = 'track_blog_view';

   -- Test the function (replace with actual post_id)
   SELECT track_blog_view(1, '192.168.1.1', 'Mozilla/5.0');
   ```

### Option 2: Using psql Command Line

If you have direct database access:

```bash
# Connect to your database
psql -h <your-db-host> -U postgres -d <your-db-name>

# Run the migration file
\i database_updates/create_blog_view_tracking.sql

# Verify
SELECT * FROM blog_view_tracking;
```

### Option 3: Using Supabase CLI

```bash
# Make sure you're in the project directory
cd santvaani-digital-ashram

# Link to your project (if not already)
supabase link --project-ref <your-project-ref>

# Run the migration
supabase db push --include-all

# Or manually execute
supabase db execute -f database_updates/create_blog_view_tracking.sql
```

## Testing the Migration

### 1. Test View Tracking Function

```sql
-- Test tracking a view
SELECT track_blog_view(
  p_post_id := 1,
  p_ip_address := '192.168.1.100',
  p_user_agent := 'Mozilla/5.0 (Test Browser)'
);

-- Expected result: {"success": true, "view_recorded": true, ...}

-- Try tracking same IP again immediately
SELECT track_blog_view(
  p_post_id := 1,
  p_ip_address := '192.168.1.100',
  p_user_agent := 'Mozilla/5.0 (Test Browser)'
);

-- Expected result: {"success": true, "view_recorded": false, "message": "View already counted in the last 24 hours"}
```

### 2. Check View Count Incremented

```sql
-- Check that the blog post view_count was incremented
SELECT id, title, view_count FROM blog_posts WHERE id = 1;
```

### 3. View Tracking Records

```sql
-- See all view tracking records
SELECT
  id,
  post_id,
  ip_address,
  user_agent,
  viewed_at
FROM blog_view_tracking
ORDER BY viewed_at DESC
LIMIT 10;
```

## Deployment Steps

### 1. Apply Database Migration
Follow the instructions above to run the SQL migration.

### 2. Deploy Backend Changes
```bash
# Commit the changes
git add backend/server.js
git commit -m "Implement IP-based blog view tracking"

# Push to trigger deployment (if auto-deploy is enabled)
git push origin main

# Or manually deploy to Render/your hosting service
```

### 3. Deploy Frontend Changes
```bash
# Commit the changes
git add frontend/src/pages/blog/index.tsx
git add frontend/src/hooks/useServerBlogView.ts
git add frontend/src/pages/blog/post/[slug].tsx
git commit -m "Update blog listing and implement server-side view tracking"

# Push to trigger Vercel deployment
git push origin main
```

### 4. Verify in Production

1. **Test Blog Listing**
   - Visit https://santvaani.com/blog
   - Verify that ALL blog posts are showing (not just 3)
   - Verify posts are sorted by latest first

2. **Test View Tracking**
   - Visit a blog post
   - Wait at least 3 seconds
   - Check browser console for success message
   - Refresh the page
   - Verify view count doesn't increment again
   - Wait 24 hours or test from different IP to see count increment

3. **Check Backend Logs**
   - On Render.com dashboard, check logs for:
     ```
     📊 View tracking attempt: Post X from IP xxx.xxx.xxx.xxx
     ✅ View tracking result: ...
     ```

## Rollback Plan

If something goes wrong, you can rollback:

### Rollback Database Changes
```sql
-- Drop the new function and table
DROP FUNCTION IF EXISTS track_blog_view(INTEGER, VARCHAR, TEXT);
DROP FUNCTION IF EXISTS has_recent_view(INTEGER, VARCHAR);
DROP FUNCTION IF EXISTS cleanup_old_view_tracking();
DROP TABLE IF EXISTS blog_view_tracking;

-- Restore old increment function if needed
-- (Your existing increment_blog_view_count function should still be there)
```

### Rollback Code Changes
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

## Maintenance

### Cleanup Old Records (Optional)

Run this monthly to clean up old tracking data and save storage:

```sql
-- Remove records older than 30 days
SELECT cleanup_old_view_tracking();
```

You can set up a cron job or scheduled function to run this automatically.

### Monitor Performance

```sql
-- Check table size
SELECT pg_size_pretty(pg_total_relation_size('blog_view_tracking'));

-- Check number of records
SELECT COUNT(*) FROM blog_view_tracking;

-- Check recent tracking activity
SELECT
  DATE(viewed_at) as date,
  COUNT(*) as views
FROM blog_view_tracking
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(viewed_at)
ORDER BY date DESC;
```

## Troubleshooting

### Issue: "Function track_blog_view does not exist"
**Solution**: Run the migration SQL file again.

### Issue: View count not incrementing
**Solution**:
1. Check backend logs for errors
2. Verify the `track_blog_view` function exists
3. Test the function manually in Supabase SQL Editor

### Issue: View count incrementing on every refresh
**Solution**:
1. Verify the 24-hour deduplication is working
2. Check that the same IP is being captured consistently
3. Look for "View already counted" message in console

### Issue: CORS errors when calling /api/blog/track-view
**Solution**:
1. Verify your frontend URL is in the CORS whitelist in `backend/server.js`
2. Check that the backend is running and accessible
3. Ensure `withCredentials` is set correctly in the axios call

## Benefits of New System

✅ **Reliable**: No dependency on localStorage
✅ **Cross-device**: Track views regardless of device
✅ **Fair counting**: 24-hour cooldown prevents spam
✅ **Better analytics**: Store IP and user agent data
✅ **Scalable**: Server-side solution handles high traffic
✅ **Maintainable**: Clean separation of concerns

## Next Steps

After successful deployment:
1. ✅ Monitor view counts for accuracy
2. ✅ Check that duplicate views are properly prevented
3. ✅ Verify all blogs show on listing page
4. Consider adding analytics dashboard for view trends
5. Consider implementing view count by location/region using IP data
