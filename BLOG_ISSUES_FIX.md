# 🔧 Blog Issues - Complete Fix Guide

You've created your first blog! 🎉 But there are 4 issues to fix:

---

## ❌ Issue 1: Can't Upload Images

### **Problem:**
Image upload fails with error: "new row violates row-level security policy"

### **Solution: Run SQL in Supabase**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Copy-paste this SQL:

```sql
-- Fix Blog Image Upload Policies

DROP POLICY IF EXISTS "Allow authenticated uploads to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from blog-images" ON storage.objects;

CREATE POLICY "Allow authenticated uploads to blog-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'santvaani-assets');

CREATE POLICY "Public read access to blog images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'santvaani-assets');

CREATE POLICY "Allow authenticated updates to blog-images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'santvaani-assets')
WITH CHECK (bucket_id = 'santvaani-assets');

CREATE POLICY "Allow authenticated deletes from blog-images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'santvaani-assets');
```

6. Click **"Run"**
7. Should see ✅ "Success"
8. Try uploading image again - it will work!

---

## ❌ Issue 2: "Page Not Found" When Clicking Blog

### **Problem:**
After saving blog, clicking "Read More" shows 404 error

### **Possible Causes & Solutions:**

#### **Cause A: Blog Not Saved Properly**
- Check if blog appears in the blog list (admin panel → Blogs)
- If not there, create it again

#### **Cause B: Wrong Slug Format**
- Slug must be lowercase, no spaces, use hyphens
- ✅ Good: `hanuman-chalisa-benefits`
- ❌ Bad: `Hanuman Chalisa Benefits` or `हनुमान चालीसा`

**How to check/fix:**
1. Go to Admin → Blogs
2. Find your blog in the list
3. Click Edit
4. Check the **Slug** field
5. Make sure it's in English, lowercase, with hyphens
6. Example: `test-blog` or `my-first-blog`
7. Save again

#### **Cause C: Blog Status is "Draft"**
- Published blogs work, drafts might not show
- Check Status field = "Published" (not "Draft")

---

## ❌ Issue 3: Can't Exit Fullscreen

### **Problem:**
When you click "Maximize" to read full-screen, there's no obvious way to exit

### **Solution: The X Button Exists!**

**The close button is at the TOP-RIGHT corner:**
- Look for a small **X** icon
- It's in the top navigation bar of the reader
- Color: Gray/White (depends on theme)
- Click it to exit fullscreen

**Alternative Ways to Exit:**
- Press **ESC** key on keyboard
- Press **F11** (if true browser fullscreen)

**If still hard to see:**
I can make the X button bigger and more visible. Want me to do that?

---

## ❌ Issue 4: AI Not Working

### **Problem:**
Clicking "Generate SEO Suggestions" doesn't show AI suggestions

### **Debug Steps:**

#### **Step 1: Check Browser Console**
1. Open your admin panel
2. Press **F12** (opens Developer Tools)
3. Click **"Console"** tab
4. Go to Create Blog page
5. Fill title and excerpt
6. Click "Generate SEO Suggestions"
7. Look for this message:
   ```
   🔑 Checking API key... Key found!
   OR
   🔑 Checking API key... Key missing!
   ```

#### **Step 2: Based on Console Message**

**If says "Key found!":**
- Environment variable is working
- But API might be failing
- Check for other error messages in console
- Tell me what errors you see

**If says "Key missing!":**
- Environment variable not deployed
- **Fix:**
  1. Go to Vercel Dashboard
  2. Click your admin project
  3. Settings → Environment Variables
  4. Find `VITE_GROQ_API_KEY`
  5. Make sure ALL THREE are checked:
     - ☑ Production
     - ☑ Preview
     - ☑ Development
  6. If not checked, edit and check all
  7. Redeploy: Deployments → "..." → "Redeploy"
  8. Wait 3 minutes
  9. Hard refresh browser: Ctrl+Shift+R
  10. Try again

#### **Step 3: Check API Key Value**

**Verify in Vercel:**
1. Go to Vercel → Your admin project
2. Settings → Environment Variables
3. Find `VITE_GROQ_API_KEY`
4. Click "..." → "Edit"
5. Make sure Value starts with: `gsk_`
6. It should be the same as your chatbot API key

---

## 🎯 Quick Checklist

Before creating next blog, make sure:

- [ ] SQL ran successfully in Supabase (for images)
- [ ] Slug is in English, lowercase, with hyphens
- [ ] Status is "Published" (not Draft)
- [ ] VITE_GROQ_API_KEY is in Vercel (all 3 environments)
- [ ] Vercel redeployed after adding variable
- [ ] Browser cache cleared (Ctrl+Shift+R)

---

## 📋 What Works vs What Doesn't

### ✅ **What Works:**
1. ✅ Creating blog posts
2. ✅ All text fields (title, content, excerpt)
3. ✅ Tags, quotes, saints
4. ✅ SEO score calculation
5. ✅ Publishing blogs
6. ✅ Fullscreen reader (X button exists)

### ❌ **What Needs Fixing:**
1. ❌ Image upload (needs SQL fix)
2. ❌ AI suggestions (needs Vercel env variable check)
3. ❌ Blog 404 error (needs slug check)
4. ⚠️ X button visibility (can be improved)

---

## 🚀 Next Steps

### **Priority 1: Fix Image Upload (5 minutes)**
- Run SQL in Supabase (see Issue 1)
- Test by uploading an image

### **Priority 2: Fix Blog 404 (2 minutes)**
- Check your blog's slug in admin panel
- Make sure it's: lowercase-with-hyphens
- Resave if needed

### **Priority 3: Verify AI (5 minutes)**
- Check console for "Key found!" message
- If missing, check Vercel environment variables
- Redeploy if needed

---

## 💡 Temporary Workarounds

**Until fixes are done:**

1. **No Image?**
   - Create blogs without images for now
   - Add images later after SQL fix

2. **AI Not Working?**
   - Use the fallback suggestions (they appear anyway)
   - They're basic but functional

3. **Can't Find X Button?**
   - Look top-right corner of reader
   - Press ESC key to exit
   - Or close the browser tab and reopen

---

## 🆘 Still Need Help?

Tell me:
1. **Which issue are you facing most?**
   - Image upload?
   - 404 error?
   - AI not working?
   - Can't find X button?

2. **What does browser console say?**
   - Press F12 → Console tab
   - Copy any error messages

3. **What's your blog slug?**
   - Go to admin → Blogs → Edit your blog
   - Tell me what's in the "Slug" field

I'll help you fix it! 😊
