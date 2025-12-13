# SantVaani Space - Complete Documentation

**Last Updated:** December 14, 2024
**Version:** 2.0 (Personal Social Feed)
**Status:** Production Ready ✅

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Feature History](#feature-history)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Backend API](#backend-api)
6. [Frontend Components](#frontend-components)
7. [Admin Panel](#admin-panel)
8. [User Guide](#user-guide)
9. [Developer Guide](#developer-guide)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

**SantVaani Space** is a personal spiritual social media feed where you (the admin) can share spiritual wisdom, quotes, and teachings with your community. Users can engage through likes and comments.

### Key Features

✅ **Personal Social Feed** - Your spiritual content, beautifully presented
✅ **Custom Profile Photos** - Upload your photo for each post
✅ **Image Posts** - Share images with your spiritual messages
✅ **Bilingual Support** - English & Hindi content
✅ **Engagement Features** - Likes with animations, Comments, Share buttons
✅ **Responsive Design** - Beautiful on mobile & desktop
✅ **Instagram-Style UI** - Modern, clean, familiar interface
✅ **No Categories** - Simple, focused feed without clutter

---

## 📜 Feature History

### Version 2.0 (Current) - December 14, 2024
- **MAJOR REDESIGN**: Transformed into personal social feed
- ❌ **Removed**: Categories completely (no more filters/tags)
- ✅ **Added**: Profile photo upload feature
- ✅ **Added**: Direct image upload to Supabase Storage
- 🎨 **Redesigned**: Instagram-style minimal header
- 🎨 **Redesigned**: Clean feed layout without category clutter
- 🔧 **Fixed**: Modal scrolling in admin panel
- 🔧 **Fixed**: Comments no longer ask for name

### Version 1.0 - Initial Release
- Basic spiritual post feed
- Category-based filtering
- Manual URL input for images
- Like and comment functionality

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (Build tool)
- React Router (Routing)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Axios (HTTP client)
- Lucide React (Icons)

**Backend:**
- Node.js + Express.js
- Supabase (PostgreSQL Database)
- Supabase Storage (Image hosting)

**Admin Panel:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase Client

### File Structure

```
santvaani-digital-ashram/
├── backend/
│   └── server.js                      # API endpoints (lines 3588-4114)
├── frontend/
│   └── src/
│       ├── pages/
│       │   └── santvaani-space/
│       │       ├── index.tsx          # Main feed page
│       │       └── [postId].tsx       # Post detail page
│       └── components/
│           └── santvaani-space/
│               ├── PostCard.tsx       # Individual post card
│               ├── LikeButton.tsx     # Like button with animation
│               └── CommentSection.tsx # Comments component
├── admin/
│   └── src/
│       ├── pages/
│       │   └── SantVaaniSpace.tsx     # Admin posts management
│       └── components/
│           └── SpacePostForm.tsx      # Create/edit post form
└── database/
    ├── santvaani_space_migration.sql           # Initial schema
    └── santvaani_space_remove_categories.sql   # V2.0 migration
```

---

## 🗄️ Database Schema

### Table: `spiritual_posts`

```sql
CREATE TABLE spiritual_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Content (Bilingual)
  title TEXT NOT NULL,
  title_hi TEXT,
  content TEXT NOT NULL,
  content_hi TEXT,

  -- Media
  image_url TEXT,
  profile_photo_url TEXT,              -- NEW in V2.0

  -- Deprecated
  category TEXT DEFAULT NULL,          -- No longer used

  -- Engagement Metrics (auto-updated via triggers)
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,

  -- Publishing
  is_published BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_spiritual_posts_created_at ON spiritual_posts(created_at DESC);
CREATE INDEX idx_spiritual_posts_is_published ON spiritual_posts(is_published);
```

### Table: `post_likes`

```sql
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES spiritual_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(post_id, user_id)  -- One like per user per post
);
```

**Indexes:**
```sql
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
```

### Table: `post_comments`

```sql
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES spiritual_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,             -- Auto-set to "SantVaani User"
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_post_comments_user_id ON post_comments(user_id);
```

### Database Triggers

**Auto-update `likes_count`:**
```sql
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE spiritual_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE spiritual_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_likes_count
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();
```

**Auto-update `comments_count`:**
```sql
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE spiritual_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE spiritual_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comments_count
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();
```

---

## 🔌 Backend API

**Base URL:** `https://santvaani-backend.onrender.com` (Production)
**Local:** `http://localhost:5000`

### Posts Endpoints

#### 1. Get Published Posts (Feed)
```http
GET /api/santvaani-space/posts?page=1&limit=10
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Posts per page

**Response:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "Daily Wisdom",
      "title_hi": "दैनिक ज्ञान",
      "content": "Be present in the moment...",
      "content_hi": "वर्तमान में उपस्थित रहें...",
      "image_url": "https://...",
      "profile_photo_url": "https://...",
      "category": null,
      "likes_count": 42,
      "comments_count": 15,
      "is_published": true,
      "created_at": "2024-12-14T10:30:00Z",
      "updated_at": "2024-12-14T10:30:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

#### 2. Get Single Post
```http
GET /api/santvaani-space/posts/:postId
```

**Response:** Single post object

#### 3. Get All Posts (Admin - includes unpublished)
```http
GET /api/santvaani-space/admin/posts?page=1&limit=20&search=wisdom
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `search` (string) - Search in title/content

#### 4. Create Post (Admin)
```http
POST /api/santvaani-space/posts
Content-Type: application/json

{
  "title": "Morning Wisdom",
  "title_hi": "सुबह का ज्ञान",
  "content": "Start your day with gratitude...",
  "content_hi": "कृतज्ञता के साथ अपना दिन शुरू करें...",
  "image_url": "https://...",
  "profile_photo_url": "https://...",
  "is_published": true
}
```

**Response:** Created post object

#### 5. Update Post (Admin)
```http
PUT /api/santvaani-space/posts/:postId
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "is_published": false
}
```

#### 6. Delete Post (Admin)
```http
DELETE /api/santvaani-space/posts/:postId
```

#### 7. Toggle Publish Status (Admin)
```http
PATCH /api/santvaani-space/posts/:postId/publish
Content-Type: application/json

{
  "is_published": true
}
```

### Likes Endpoints

#### 8. Like a Post
```http
POST /api/santvaani-space/posts/:postId/like
Content-Type: application/json

{
  "userId": "user-id-from-localStorage"
}
```

#### 9. Unlike a Post
```http
DELETE /api/santvaani-space/posts/:postId/like
Content-Type: application/json

{
  "userId": "user-id-from-localStorage"
}
```

#### 10. Check if User Liked Post
```http
GET /api/santvaani-space/posts/:postId/liked?userId=user-id
```

**Response:**
```json
{
  "liked": true
}
```

### Comments Endpoints

#### 11. Get Post Comments
```http
GET /api/santvaani-space/posts/:postId/comments
```

**Response:**
```json
{
  "comments": [
    {
      "id": "uuid",
      "post_id": "uuid",
      "user_id": "user-id",
      "user_name": "SantVaani User",
      "comment": "Beautiful message!",
      "created_at": "2024-12-14T11:00:00Z",
      "updated_at": "2024-12-14T11:00:00Z"
    }
  ]
}
```

#### 12. Add Comment
```http
POST /api/santvaani-space/posts/:postId/comments
Content-Type: application/json

{
  "userId": "user-id",
  "userName": "SantVaani User",  // Auto-set by frontend
  "comment": "This is inspiring!"
}
```

#### 13. Update Comment
```http
PUT /api/santvaani-space/posts/:postId/comments/:commentId
Content-Type: application/json

{
  "userId": "user-id",
  "comment": "Updated comment text"
}
```

#### 14. Delete Comment
```http
DELETE /api/santvaani-space/posts/:postId/comments/:commentId
Content-Type: application/json

{
  "userId": "user-id"
}
```

### Analytics Endpoint

#### 15. Get Analytics (Admin)
```http
GET /api/santvaani-space/analytics
```

**Response:**
```json
{
  "totalPosts": 50,
  "publishedPosts": 45,
  "totalLikes": 1234,
  "totalComments": 567
}
```

---

## 🎨 Frontend Components

### 1. Feed Page (`frontend/src/pages/santvaani-space/index.tsx`)

**Route:** `/santvaani-space`

**Features:**
- Displays all published posts in reverse chronological order
- Pagination with "Load More" button
- Clean Instagram-style header
- Responsive design

**Key Functions:**
```typescript
fetchPosts(pageNum: number)  // Fetch posts with pagination
handleLoadMore()             // Load next page
handlePostClick(postId)      // Navigate to post detail
```

**State:**
```typescript
posts: SpiritualPost[]       // Array of posts
loading: boolean             // Loading state
error: string | null         // Error message
page: number                 // Current page
hasMore: boolean             // More posts available
```

### 2. Post Detail Page (`frontend/src/pages/santvaani-space/[postId].tsx`)

**Route:** `/santvaani-space/:postId`

**Features:**
- Full post view with image
- Like button
- Comment section
- Share functionality

**Key Functions:**
```typescript
fetchPost(postId)           // Fetch single post
handleShare()               // Native share or clipboard copy
```

### 3. PostCard Component (`frontend/src/components/santvaani-space/PostCard.tsx`)

**Props:**
```typescript
interface PostCardProps {
  post: SpiritualPost
  onClick: () => void
}
```

**Features:**
- Instagram-style post card
- Profile photo (custom or Om symbol fallback)
- Full-width images
- Collapsible content ("See more/less")
- Like, comment, share buttons
- Displays date (no category)

**Key Logic:**
```typescript
// Profile photo with fallback
{post.profile_photo_url ? (
  <img src={post.profile_photo_url} className="w-10 h-10 rounded-full" />
) : (
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-purple-600">
    🕉️
  </div>
)}

// Collapsible content
const isLongContent = content.length > 150
const displayContent = expanded ? content : content.substring(0, 150) + '...'
```

### 4. LikeButton Component (`frontend/src/components/santvaani-space/LikeButton.tsx`)

**Props:**
```typescript
interface LikeButtonProps {
  postId: string
  initialLikes: number
  initialLiked?: boolean
  userId?: string
}
```

**Features:**
- Heart icon that fills pink when liked
- Floating hearts animation on like
- Optimistic UI updates (immediate feedback)
- Auto-reverts on API error

**Animation:**
```typescript
// 5 floating hearts on like
{[...Array(5)].map((_, i) => (
  <motion.div
    initial={{ opacity: 1, y: 0, scale: 0.5 }}
    animate={{
      opacity: 0,
      y: -100 + Math.random() * 50,
      x: (Math.random() - 0.5) * 100,
      scale: 1 + Math.random() * 0.5
    }}
  >
    <Heart className="fill-pink-500" />
  </motion.div>
))}
```

### 5. CommentSection Component (`frontend/src/components/santvaani-space/CommentSection.tsx`)

**Props:**
```typescript
interface CommentSectionProps {
  postId: string
  userId?: string
}
```

**Features:**
- Add comments (no name required - auto "SantVaani User")
- View all comments with timestamps
- Delete own comments
- Animated comment cards

**Key Changes (V2.0):**
- ❌ Removed name input field
- ✅ Auto-sets name to "SantVaani User" (English) or "संतवाणी उपयोगकर्ता" (Hindi)

---

## 🔧 Admin Panel

### 1. SantVaani Space Page (`admin/src/pages/SantVaaniSpace.tsx`)

**Route:** `/santvaani-space`

**Features:**
- Analytics cards (Total Posts, Published, Likes, Comments)
- Search posts
- View all posts (published + unpublished)
- Inline toggle publish/unpublish
- Edit/delete posts
- Create new posts

**Key Functions:**
```typescript
fetchPosts()                    // Get all posts
fetchAnalytics()                // Get stats
togglePublish(id, status)       // Toggle publish status
deletePost(id)                  // Delete post
```

**UI Components:**
- Analytics Dashboard (4 stat cards)
- Search bar
- Posts table with actions
- Create/Edit modal

### 2. SpacePostForm Component (`admin/src/components/SpacePostForm.tsx`)

**Props:**
```typescript
interface SpacePostFormProps {
  post?: SpiritualPost | null  // If editing
  onClose: () => void
  onSuccess: () => void
}
```

**Features:**
- Create/edit posts
- Bilingual inputs (English + Hindi)
- **Profile photo upload** (direct to Supabase Storage)
- **Post image upload** (direct to Supabase Storage)
- URL input fallback for both
- Live previews
- Publish toggle

**Form Fields:**
1. **Title (English)** - Required
2. **Title (Hindi)** - Optional
3. **Content (English)** - Required, multiline
4. **Content (Hindi)** - Optional, multiline
5. **Post Image** - Upload or URL
6. **Profile Photo** - Upload or URL (NEW in V2.0)
7. **Publish immediately** - Checkbox

**Image Upload Logic:**
```typescript
const handleImageUpload = async (file) => {
  // Validate file (type, size)
  // Generate unique filename
  const fileName = `${Math.random()}.${ext}`

  // Upload to Supabase Storage
  const { data } = await supabase.storage
    .from('spiritual-posts')
    .upload(fileName, file)

  // Get public URL
  const { publicUrl } = supabase.storage
    .from('spiritual-posts')
    .getPublicUrl(fileName)

  // Update form
  setFormData({ ...formData, image_url: publicUrl })
}
```

**Profile Photo Upload:**
- Same logic as image upload
- Max 1MB (vs 2MB for post images)
- Recommended: Square image (500x500px)
- Shows circular preview
- Filename prefix: `profile-`

**Modal Scrolling (Fixed in V2.0):**
```typescript
<div className="fixed inset-0 flex items-center justify-center z-50">
  <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
    {/* Sticky header with z-10 */}
    {/* Scrollable form content */}
  </div>
</div>
```

---

## 📖 User Guide

### For Admins

#### Creating a Post

1. **Login to Admin Panel**
   - URL: `https://santvaani-admin-panel.vercel.app`

2. **Navigate to SantVaani Space**
   - Click "SantVaani Space" in sidebar

3. **Click "New Post"**
   - Opens create post modal

4. **Fill in Post Details:**
   - **Title (English):** Required - Main heading
   - **Title (Hindi):** Optional - Hindi translation
   - **Content (English):** Required - Your message
   - **Content (Hindi):** Optional - Hindi translation

5. **Upload Your Profile Photo:**
   - Click upload area under "Profile Photo"
   - Choose square image (500x500px recommended)
   - Max 1MB
   - OR paste URL manually
   - Preview shows circular crop

6. **Upload Post Image (Optional):**
   - Click upload area under "Post Image"
   - Choose image (1200x630px recommended)
   - Max 2MB
   - OR paste URL manually
   - Preview shows how it'll look

7. **Set Publish Status:**
   - Check "Publish immediately" to go live
   - Uncheck to save as draft

8. **Click "Create Post"**
   - Post appears in feed if published
   - Saved to drafts if unpublished

#### Managing Posts

**Edit Post:**
- Click ✏️ Edit icon next to post
- Make changes
- Click "Update Post"

**Toggle Publish:**
- Click publish status badge
- Toggles between Published/Draft

**Delete Post:**
- Click 🗑️ Delete icon
- Confirm deletion
- Post and all likes/comments deleted permanently

**Search Posts:**
- Use search bar to find by title/content
- Real-time filtering

### For Users

#### Viewing the Feed

1. **Visit:** `https://santvaani.vercel.app/santvaani-space`

2. **Browse Posts:**
   - Scroll through feed
   - Click "Load More" for older posts

3. **Read Full Post:**
   - Click "See more" to expand long content
   - OR click anywhere on post card to view detail page

#### Liking Posts

1. **Click Heart Icon** ❤️
   - Heart fills pink
   - Floating hearts animation
   - Like count increases

2. **Unlike:**
   - Click heart again
   - Heart unfills
   - Count decreases

**Note:** Requires userId in localStorage (set by app auth)

#### Commenting

1. **Click on Post** to open detail view

2. **Scroll to Comments Section**

3. **Type Your Comment:**
   - No name required!
   - Auto-displays as "SantVaani User"

4. **Click "Post Comment"**
   - Comment appears instantly
   - No page reload

5. **Delete Your Comment:**
   - Click 🗑️ icon on your own comments only

#### Sharing Posts

1. **Click Share Icon** 🔗

2. **On Mobile:**
   - Native share sheet opens
   - Share to any app

3. **On Desktop:**
   - URL copied to clipboard
   - Paste anywhere to share

---

## 👨‍💻 Developer Guide

### Setting Up Locally

#### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

#### 1. Clone Repository
```bash
git clone https://github.com/your-repo/santvaani-digital-ashram.git
cd santvaani-digital-ashram
```

#### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**Admin:**
```bash
cd admin
npm install
```

#### 3. Environment Variables

**Backend (.env):**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=5000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Admin (.env):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 4. Setup Database

Run migrations in Supabase SQL Editor:

```bash
# Initial schema
database/santvaani_space_migration.sql

# V2.0 updates (remove categories, add profile photos)
database/santvaani_space_remove_categories.sql
```

#### 5. Create Supabase Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Click "Create bucket"
3. Name: `spiritual-posts`
4. **Public:** ON (enable public access)
5. Add RLS policies:

```sql
-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'spiritual-posts');

-- Allow public reads
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'spiritual-posts');
```

#### 6. Run Development Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Admin:**
```bash
cd admin
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Admin: http://localhost:5174
- Backend: http://localhost:5000

### Code Structure

#### Adding a New Feature to PostCard

**Example: Add a "Bookmark" button**

1. **Update Interface:**
```typescript
// frontend/src/pages/santvaani-space/index.tsx
export interface SpiritualPost {
  // ... existing fields
  bookmarks_count: number  // NEW
}
```

2. **Update Database:**
```sql
ALTER TABLE spiritual_posts
ADD COLUMN bookmarks_count INTEGER DEFAULT 0;

CREATE TABLE post_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES spiritual_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
```

3. **Create Component:**
```typescript
// frontend/src/components/santvaani-space/BookmarkButton.tsx
const BookmarkButton = ({ postId, initialBookmarks, userId }) => {
  const [bookmarked, setBookmarked] = useState(false)

  const handleBookmark = async () => {
    // API call
    await axios.post(`/api/santvaani-space/posts/${postId}/bookmark`)
    setBookmarked(!bookmarked)
  }

  return (
    <button onClick={handleBookmark}>
      <Bookmark className={bookmarked ? 'fill-yellow-500' : ''} />
    </button>
  )
}
```

4. **Add to PostCard:**
```typescript
// frontend/src/components/santvaani-space/PostCard.tsx
import BookmarkButton from './BookmarkButton'

// In action buttons section:
<BookmarkButton
  postId={post.id}
  initialBookmarks={post.bookmarks_count}
  userId={userId}
/>
```

5. **Add Backend API:**
```javascript
// backend/server.js
app.post('/api/santvaani-space/posts/:postId/bookmark', async (req, res) => {
  const { postId } = req.params
  const { userId } = req.body

  const { data, error } = await supabase
    .from('post_bookmarks')
    .insert([{ post_id: postId, user_id: userId }])

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})
```

### Testing

#### Manual Testing Checklist

**Admin Panel:**
- [ ] Create post with profile photo
- [ ] Create post with post image
- [ ] Create post with both photos
- [ ] Create post without images (text only)
- [ ] Edit existing post
- [ ] Toggle publish/unpublish
- [ ] Delete post
- [ ] Search posts
- [ ] View analytics

**Frontend Feed:**
- [ ] View posts in feed
- [ ] See profile photos correctly
- [ ] See post images full-width
- [ ] Expand/collapse long content
- [ ] Load more posts (pagination)
- [ ] Navigate to post detail

**Engagement:**
- [ ] Like a post (see animation)
- [ ] Unlike a post
- [ ] Like count updates
- [ ] Add comment (no name prompt)
- [ ] View comments
- [ ] Delete own comment
- [ ] Share post (mobile native share)
- [ ] Share post (desktop clipboard)

**Responsive:**
- [ ] Mobile (< 640px)
- [ ] Tablet (640-1024px)
- [ ] Desktop (> 1024px)

**Bilingual:**
- [ ] Switch to Hindi
- [ ] All UI translates
- [ ] Hindi content displays
- [ ] Switch back to English

---

## 🚀 Deployment

### Current Production Setup

**Frontend:** Vercel
**Admin:** Vercel
**Backend:** Render
**Database:** Supabase
**Storage:** Supabase Storage

### Deployment URLs

- **Frontend:** https://santvaani.vercel.app/santvaani-space
- **Admin:** https://santvaani-admin-panel.vercel.app/santvaani-space
- **Backend:** https://santvaani-backend.onrender.com

### Deployment Process

#### Automatic Deployment (Current)

**When you push to `main` branch:**

1. **GitHub** receives push
2. **Vercel** auto-deploys frontend & admin (1-2 min)
3. **Render** auto-deploys backend (2-3 min)

**Wait 3 minutes total**, then changes are live!

#### Manual Deployment

**Vercel (Frontend/Admin):**
1. Go to Vercel dashboard
2. Select project
3. Click "Deployments"
4. Click "Redeploy" on latest deployment

**Render (Backend):**
1. Go to Render dashboard
2. Select "santvaani-backend" service
3. Click "Manual Deploy" → "Deploy latest commit"

#### Database Migrations

**Run in Supabase SQL Editor:**

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Click "New query"
4. Paste migration SQL
5. Click "Run"

**Example:**
```sql
-- V2.0 Migration
ALTER TABLE spiritual_posts
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

ALTER TABLE spiritual_posts
ALTER COLUMN category DROP NOT NULL,
ALTER COLUMN category SET DEFAULT NULL;
```

### Environment Variables (Production)

**Vercel (Frontend):**
```
VITE_API_URL=https://santvaani-backend.onrender.com
VITE_SUPABASE_URL=https://uamedkwrdwcwdznakdvq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Vercel (Admin):**
```
VITE_SUPABASE_URL=https://uamedkwrdwcwdznakdvq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Render (Backend):**
```
SUPABASE_URL=https://uamedkwrdwcwdznakdvq.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
PORT=5000
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Failed to load posts" in Frontend

**Symptoms:**
- Feed shows error message
- Console: 404 or 500 errors

**Solutions:**
```bash
# Check backend is running
curl https://santvaani-backend.onrender.com/health

# Check API endpoint
curl https://santvaani-backend.onrender.com/api/santvaani-space/posts

# If 404, check server.js routes are BEFORE 404 handler
# Lines 3588-4114 must be BEFORE 404 handler
```

#### 2. "Bucket not found" when uploading images

**Symptoms:**
- Upload fails in admin
- Console: `StorageApiError: Bucket not found`

**Solution:**
1. Create `spiritual-posts` bucket in Supabase Storage
2. Make it PUBLIC
3. Add RLS policies (see Setup Guide above)

#### 3. Modal covers entire screen (Admin)

**Symptoms:**
- Can't scroll in create/edit form
- Content cut off

**Solution:**
Already fixed in V2.0. If issue persists:
```tsx
// admin/src/components/SpacePostForm.tsx
<div className="fixed inset-0 flex items-center justify-center z-50">
  <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
    {/* Content */}
  </div>
</div>
```

#### 4. Comments ask for name

**Symptoms:**
- Name input field appears in comments

**Solution:**
Already fixed in V2.0. Verify you have latest code:
```tsx
// frontend/src/components/santvaani-space/CommentSection.tsx
// Should NOT have userName state or input field
userName: language === 'hi' ? 'संतवाणी उपयोगकर्ता' : 'SantVaani User'
```

#### 5. Like/Comment not working

**Symptoms:**
- Clicking heart/comment does nothing
- No error in console

**Check:**
```javascript
// localStorage must have userId
console.log(localStorage.getItem('userId'))

// If null, user not authenticated
// Set manually for testing:
localStorage.setItem('userId', 'test-user-123')
```

#### 6. Profile photo not showing

**Symptoms:**
- Om symbol shows instead of custom photo
- Console: Failed to load image

**Check:**
1. Image URL is valid and public
2. Supabase Storage bucket is PUBLIC
3. RLS policies allow public SELECT
4. Image format is supported (JPG, PNG, WebP)

```sql
-- Check bucket policies
SELECT * FROM storage.policies WHERE bucket_id = 'spiritual-posts';

-- Should have at least one SELECT policy for 'public' role
```

#### 7. Deployment failed - TypeScript errors

**Symptoms:**
- Vercel/Render build fails
- Error: Property 'X' is missing in type 'Y'

**Solution:**
Update all interfaces to match:
```typescript
// Ensure all files have consistent interface:
interface SpiritualPost {
  id: string
  title: string
  title_hi: string | null
  content: string
  content_hi: string | null
  image_url: string | null
  profile_photo_url: string | null  // Must be in ALL files
  likes_count: number
  comments_count: number
  is_published: boolean
  created_at: string
  updated_at: string
}
```

**Files to check:**
- `admin/src/pages/SantVaaniSpace.tsx`
- `admin/src/components/SpacePostForm.tsx`
- `frontend/src/pages/santvaani-space/index.tsx`
- `frontend/src/components/santvaani-space/PostCard.tsx`

---

## 🔮 Future Enhancements

### Planned Features

#### Phase 1: Content Management
- [ ] **Scheduled Posts** - Set publish date/time
- [ ] **Post Templates** - Save frequently used formats
- [ ] **Bulk Upload** - Import multiple posts from CSV
- [ ] **Media Library** - Browse and reuse uploaded images
- [ ] **Draft Auto-save** - Don't lose work

#### Phase 2: Engagement
- [ ] **Reply to Comments** - Nested comment threads
- [ ] **Reactions** - Beyond just likes (🙏, ❤️, 🌟, 🕉️)
- [ ] **Save/Bookmark** - Users save favorite posts
- [ ] **Notifications** - Alert admins of new comments
- [ ] **Share Count** - Track how many times shared

#### Phase 3: Analytics
- [ ] **View Tracking** - Count post views
- [ ] **Engagement Dashboard** - Charts and graphs
- [ ] **Popular Posts** - Sort by likes/comments
- [ ] **User Analytics** - Track unique visitors
- [ ] **Time-based Analytics** - Engagement over time

#### Phase 4: User Experience
- [ ] **Dark Mode** - Toggle dark theme
- [ ] **Font Size Control** - Accessibility
- [ ] **Audio Posts** - Attach audio files
- [ ] **Video Posts** - Embed YouTube/Vimeo
- [ ] **Infinite Scroll** - Replace "Load More" button
- [ ] **Search Posts** - Frontend search functionality
- [ ] **Filter by Date** - "Posts from this month"

#### Phase 5: Social Features
- [ ] **User Profiles** - Replace generic "SantVaani User"
- [ ] **Following** - Follow other users
- [ ] **Private Messages** - DM between users
- [ ] **User Uploads** - Allow users to create posts
- [ ] **Moderation** - Approve/reject user posts
- [ ] **Report System** - Flag inappropriate content

#### Phase 6: Advanced
- [ ] **Multi-author Support** - Multiple admins
- [ ] **Content Series** - Group related posts
- [ ] **Featured Posts** - Pin important posts to top
- [ ] **Post Versions** - Track edit history
- [ ] **Export Data** - Download all posts as JSON/CSV
- [ ] **Import from Instagram** - Sync your Instagram posts
- [ ] **RSS Feed** - For podcast apps
- [ ] **Email Notifications** - Subscribe to new posts
- [ ] **Progressive Web App** - Install as mobile app
- [ ] **Offline Support** - Cache posts for offline reading

### Technical Improvements

- [ ] **Image Optimization** - Compress uploads automatically
- [ ] **CDN Integration** - Faster image delivery
- [ ] **Rate Limiting** - Prevent API abuse
- [ ] **Caching** - Redis for frequently accessed data
- [ ] **Real-time Updates** - WebSocket for live likes/comments
- [ ] **Error Tracking** - Sentry integration
- [ ] **Performance Monitoring** - Track load times
- [ ] **A/B Testing** - Test different UI variations
- [ ] **Automated Testing** - Unit & E2E tests
- [ ] **CI/CD Pipeline** - Automated testing before deploy

---

## 📝 Change Log

### v2.0.0 - December 14, 2024

**Breaking Changes:**
- Removed category system entirely
- Database schema updated (profile_photo_url added, category nullable)

**New Features:**
- Profile photo upload for posts
- Direct image upload to Supabase Storage (no more manual URLs)
- Auto-generated usernames for comments ("SantVaani User")

**UI/UX:**
- Redesigned header (Instagram-style minimal)
- Removed category filter dropdown
- Fixed modal scrolling in admin panel
- Cleaner, more focused feed layout

**Bug Fixes:**
- Modal content now scrollable (max-height: 90vh)
- Comments no longer ask for name
- TypeScript interfaces consistent across files

**API Changes:**
- `POST /api/santvaani-space/posts` - Accepts `profile_photo_url`, ignores `category`
- `PUT /api/santvaani-space/posts/:postId` - Same as above
- `GET /api/santvaani-space/posts` - Removed `category` query parameter

### v1.0.0 - Initial Release

- Basic post feed with categories
- Like and comment functionality
- Admin panel for content management
- Bilingual support (English/Hindi)

---

## 🤝 Contributing

### Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Test locally
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request
7. Wait for review & merge

### Commit Message Format

```
[Category] Brief description

Detailed explanation of changes...

- Bullet points for key changes
- What was added/removed/fixed
```

**Categories:**
- `[Feature]` - New functionality
- `[Fix]` - Bug fix
- `[UI]` - UI/UX improvements
- `[Refactor]` - Code cleanup
- `[Docs]` - Documentation
- `[Database]` - Schema changes
- `[API]` - Backend API changes

**Examples:**
```
[Feature] Add profile photo upload to posts

- Added profile_photo_url field to database
- Implemented Supabase Storage upload in admin
- Updated PostCard to display custom profile photos
- Fallback to Om symbol if no photo uploaded
```

```
[Fix] Modal scrolling issue in admin panel

- Changed overflow from parent to child div
- Added max-height constraint (90vh)
- Sticky header now stays on top while scrolling
```

---

## 📧 Support

**Developer:** Your Team
**Email:** support@santvaani.com
**Documentation:** This file
**Repository:** https://github.com/your-repo/santvaani-digital-ashram

---

## 📄 License

Proprietary - All rights reserved

---

**Last Updated:** December 14, 2024
**Next Review:** December 15, 2024

---

*This documentation is maintained alongside the codebase. Please update when making changes to SantVaani Space.*
