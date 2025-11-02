# Database Migration Guide - IP-Based View Tracking

## 🎯 What This Does
Creates database functions to track blog views with IP-based deduplication (24-hour cooldown).

## 📋 What You Need to Do

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your **SantVaani** project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Copy & Run the SQL Script

Copy the ENTIRE content from the file:
```
database_updates/create_blog_view_tracking.sql
```

Paste it into the SQL Editor and click **"Run"**.

### Step 3: Verify It Worked

You should see a success message. The following will be created:
- ✅ Table: `blog_view_tracking`
- ✅ Function: `track_blog_view()`
- ✅ Function: `has_recent_view()`
- ✅ Function: `cleanup_old_view_tracking()`

### Step 4: Test It

After running the SQL, test by refreshing a blog post multiple times.

**Expected behavior:**
- First visit: View count increases ✅
- Refresh immediately: View count stays the same ✅
- Refresh after 24 hours: View count increases again ✅

---

## 🧪 Quick Test

To verify the database functions work:

1. Open Supabase SQL Editor
2. Run this test query:
```sql
-- Test the tracking function
SELECT track_blog_view(
  '658073d1-db40-49a8-9475-80120950814a'::uuid,  -- Replace with your post ID
  '192.168.1.1',                                  -- Test IP
  'TestBrowser'
);
```

You should see:
```json
{
  "success": true,
  "view_recorded": true,
  "message": "View counted successfully"
}
```

3. Run it again immediately:
```sql
SELECT track_blog_view(
  '658073d1-db40-49a8-9475-80120950814a'::uuid,
  '192.168.1.1',
  'TestBrowser'
);
```

You should see:
```json
{
  "success": true,
  "view_recorded": false,
  "message": "View already counted in the last 24 hours"
}
```

This proves the 24-hour cooldown is working!

---

## 📊 How It Works

### Database Structure

**blog_view_tracking table:**
```
id          | UUID (primary key)
post_id     | UUID (references blog_posts)
ip_address  | VARCHAR(45) - supports IPv4 and IPv6
user_agent  | TEXT
viewed_at   | TIMESTAMP
```

### Deduplication Logic

1. When someone visits a blog post, the frontend calls `/api/blog/track-view`
2. Backend calls database function `track_blog_view(post_id, ip_address, user_agent)`
3. Function checks if this IP viewed this post in last 24 hours
4. If NO:
   - Records view in `blog_view_tracking` table
   - Increments `view_count` in `blog_posts` table
   - Returns `view_recorded: true`
5. If YES:
   - Does nothing
   - Returns `view_recorded: false` with cooldown message

### Why This is Better Than localStorage

| localStorage (Old) | IP-Based (New) |
|-------------------|----------------|
| ❌ Clears when cookies cleared | ✅ Tracks across browsers |
| ❌ Doesn't work in incognito | ✅ Works everywhere |
| ❌ Different on each device | ✅ Same IP = same limit |
| ❌ Easy to manipulate | ✅ Server-side = reliable |
| ❌ No analytics data | ✅ Stores IP & user agent |

---

## 🔍 Troubleshooting

### Issue: SQL gives "permission denied" error
**Solution:** Make sure you're logged in as the project owner or have admin rights.

### Issue: "function already exists"
**Solution:** The functions were already created! You can skip this step. Test to see if tracking works.

### Issue: Views still increment on every refresh
**Possible causes:**
1. Database functions not created (run the SQL)
2. Frontend not calling the endpoint (check browser console)
3. IP address not being detected (check backend logs on Render)

### Issue: How to check if functions exist?
Run this query in Supabase SQL Editor:
```sql
SELECT proname FROM pg_proc
WHERE proname IN ('track_blog_view', 'has_recent_view', 'cleanup_old_view_tracking');
```

Should return 3 rows.

---

## 🧹 Maintenance

### Clean Old Records (Optional)

The tracking table will grow over time. To remove records older than 30 days:

```sql
SELECT cleanup_old_view_tracking();
```

You can set this up as a weekly cron job in Supabase:
1. Go to Database → Cron Jobs
2. Create new job
3. Schedule: `0 0 * * 0` (every Sunday at midnight)
4. SQL: `SELECT cleanup_old_view_tracking();`

---

## 📈 View Analytics

To see view statistics:

### Total views for a post:
```sql
SELECT COUNT(*) as total_views
FROM blog_view_tracking
WHERE post_id = 'YOUR_POST_ID'::uuid;
```

### Unique IPs that viewed a post:
```sql
SELECT COUNT(DISTINCT ip_address) as unique_visitors
FROM blog_view_tracking
WHERE post_id = 'YOUR_POST_ID'::uuid;
```

### Views in last 24 hours:
```sql
SELECT COUNT(*) as recent_views
FROM blog_view_tracking
WHERE post_id = 'YOUR_POST_ID'::uuid
  AND viewed_at > NOW() - INTERVAL '24 hours';
```

### Top 10 most viewed posts:
```sql
SELECT
  bp.title,
  bp.view_count,
  COUNT(DISTINCT bvt.ip_address) as unique_visitors
FROM blog_posts bp
LEFT JOIN blog_view_tracking bvt ON bp.id = bvt.post_id
GROUP BY bp.id, bp.title, bp.view_count
ORDER BY bp.view_count DESC
LIMIT 10;
```

---

## ✅ After Database Setup

Once you've run the SQL migration:

1. **Test on your blog:** Visit a post, refresh multiple times
2. **Verify:** View count should only increase once
3. **Check console:** Browser console should show "View already counted" message
4. **Celebrate:** IP-based tracking is working! 🎉

---

**File to run:** `database_updates/create_blog_view_tracking.sql`
**Where to run:** Supabase Dashboard → SQL Editor
**Time required:** 2 minutes

Go do it now! 🚀
