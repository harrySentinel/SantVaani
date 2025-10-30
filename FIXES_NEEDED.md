# 🔧 Fixes Needed for Blog System

## ❌ Issues Found:

### 1. **AI SEO Feature - 401 Error**
**Error:** `api.groq.com/openai/v1/chat/completions: 401 Unauthorized`

**Cause:** Environment variable `VITE_GROQ_API_KEY` not available in Vercel deployment

**Fix Required:**
1. Go to Vercel Dashboard → Your Admin Project
2. Go to Settings → Environment Variables
3. Add variable:
   - Name: `VITE_GROQ_API_KEY`
   - Value: `[Your Groq API Key from chatbot .env file]`
   - Environments: Check all (Production, Preview, Development)
4. **Important:** Redeploy the site after adding the variable
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"
5. Wait 2-3 minutes for deployment to complete
6. Test again

**Alternative Quick Fix (until Vercel is updated):**
- For now, the AI feature will show fallback suggestions
- They're basic but functional
- Once Vercel env variable is added, full AI will work

---

### 2. **Image Upload - 400 Error**
**Error:** `StorageApiError: new row violates row-level security policy`

**Cause:** Supabase storage bucket doesn't have proper RLS policy for admin uploads

**Fix Required - Run this SQL in Supabase:**

```sql
-- Allow authenticated users to upload to blog-images folder
CREATE POLICY "Allow authenticated uploads to blog-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'santvaani-assets' AND
  (storage.foldername(name))[1] = 'blog-images'
);

-- Allow public read access to blog images
CREATE POLICY "Public read access to blog images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'santvaani-assets' AND
  (storage.foldername(name))[1] = 'blog-images'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates to blog-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'santvaani-assets' AND (storage.foldername(name))[1] = 'blog-images')
WITH CHECK (bucket_id = 'santvaani-assets' AND (storage.foldername(name))[1] = 'blog-images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Allow authenticated deletes from blog-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'santvaani-assets' AND (storage.foldername(name))[1] = 'blog-images');
```

**How to run:**
1. Go to Supabase Dashboard
2. Click "SQL Editor" in left sidebar
3. Click "New Query"
4. Copy-paste the above SQL
5. Click "Run" button
6. You should see "Success" message
7. Try uploading image again in admin panel

---

### 3. **Living Saints - 400 Error**
**Error:** Database query returning 400

**Cause:** Likely RLS policy issue on `living_saints` table

**Fix:** This is just a dashboard display issue, not critical for blogs

---

## ✅ What Still Works:

1. ✅ Creating blog posts (without images)
2. ✅ All text fields working
3. ✅ Tags, quotes, saints working
4. ✅ Publishing working
5. ✅ SEO score calculation working
6. ✅ AI fallback suggestions working

---

## 🚀 Quick Workaround (Use This Now):

**To create your first blog without waiting for fixes:**

1. **Skip Image Upload** - Don't upload featured image yet
2. **Use Fallback SEO** - When you click "Generate SEO Suggestions":
   - It will show error toast
   - BUT it will also show fallback suggestions
   - These are basic but good enough to start
3. **Fill all other fields** normally
4. **Publish** - It will work!

**After Vercel env variable is added:**
- AI suggestions will work perfectly
- You can edit your blog later to add an image

---

## 📝 Priority Order:

1. **HIGH:** Fix Vercel environment variable (for AI to work)
2. **MEDIUM:** Fix Supabase storage policy (for image uploads)
3. **LOW:** Fix living saints query (just dashboard display)

---

## 🎯 For Now - Create Blog Without These:

You can successfully create a blog post right now by:
- ✅ Skipping featured image
- ✅ Using fallback SEO suggestions
- ✅ All other features work perfectly!

Your first blog will be live and functional! 🚀
