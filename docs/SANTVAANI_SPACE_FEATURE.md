# SantVaani Space - Social Spiritual Feed

## Overview
SantVaani Space is a spiritual social media feed where admins post spiritual content and users can engage through likes and comments. Think of it as Instagram/Facebook but purely for spiritual content.

---

## User Stories

### As an Admin:
- I can create beautiful spiritual posts with images and text
- I can write in both English and Hindi
- I can edit/delete my posts
- I can see engagement stats (likes, comments)
- I can moderate comments (delete inappropriate ones)
- I can view all posts in admin panel

### As a User:
- I can view all spiritual posts in a beautiful feed
- I can like posts (with heart animation)
- I can comment on posts
- I can read content in English or Hindi
- I can share posts on social media
- I can see the feed on mobile (responsive design)

---

## Database Schema

### Table 1: `spiritual_posts`
```sql
CREATE TABLE spiritual_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_hi TEXT,
  content TEXT NOT NULL,
  content_hi TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_spiritual_posts_created_at ON spiritual_posts(created_at DESC);
CREATE INDEX idx_spiritual_posts_category ON spiritual_posts(category);
```

### Table 2: `post_likes`
```sql
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES spiritual_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Index for faster queries
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
```

### Table 3: `post_comments`
```sql
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES spiritual_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_post_comments_created_at ON post_comments(created_at DESC);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE spiritual_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- spiritual_posts policies
CREATE POLICY "Anyone can view published posts"
  ON spiritual_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can do everything"
  ON spiritual_posts FOR ALL
  USING (auth.role() = 'authenticated');

-- post_likes policies
CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own likes"
  ON post_likes FOR ALL
  USING (auth.uid() = user_id);

-- post_comments policies
CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON post_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Frontend Pages

### 1. User Page: `/santvaani-space`
**Location:** `frontend/src/pages/santvaani-space/index.tsx`

**Features:**
- Beautiful card-based feed layout
- Infinite scroll or pagination
- Each post card shows:
  - Image (if available)
  - Title (bilingual)
  - Content preview (bilingual)
  - Like button with count
  - Comment button with count
  - Share button
  - Timestamp
- Click card to view full post with comments
- Responsive design (mobile-first)

**Design Inspiration:**
- Instagram feed style
- Gradient backgrounds like quotes page
- Smooth animations
- Heart animation on like (confetti effect)

### 2. Post Detail Page: `/santvaani-space/[postId]`
**Location:** `frontend/src/pages/santvaani-space/[postId].tsx`

**Features:**
- Full post content
- Full-size image
- Like button
- Comment section:
  - View all comments
  - Add comment (requires auth)
  - Delete own comments
  - See commenter names
- Share options
- Back to feed button

### 3. Admin Pages

#### a) Posts List: `admin/src/pages/SantVaaniSpace.tsx`
**Features:**
- View all posts in table
- Search/filter posts
- Stats: total posts, total likes, total comments
- Quick actions: Edit, Delete, View
- Create new post button

#### b) Create/Edit Post: `admin/src/components/SpacePostForm.tsx`
**Features:**
- Title (English + Hindi)
- Content (English + Hindi) with rich text editor
- Category dropdown
- Image upload
- Preview mode
- Publish/Draft toggle
- Save button

---

## Backend API Endpoints

### Posts Endpoints

```javascript
// Get all published posts (with pagination)
GET /api/santvaani-space/posts?page=1&limit=10

// Get single post by ID
GET /api/santvaani-space/posts/:postId

// Create new post (Admin only)
POST /api/santvaani-space/posts

// Update post (Admin only)
PUT /api/santvaani-space/posts/:postId

// Delete post (Admin only)
DELETE /api/santvaani-space/posts/:postId

// Get post stats
GET /api/santvaani-space/posts/:postId/stats
```

### Likes Endpoints

```javascript
// Like a post
POST /api/santvaani-space/posts/:postId/like

// Unlike a post
DELETE /api/santvaani-space/posts/:postId/like

// Check if user liked a post
GET /api/santvaani-space/posts/:postId/liked
```

### Comments Endpoints

```javascript
// Get comments for a post
GET /api/santvaani-space/posts/:postId/comments?page=1&limit=20

// Add comment
POST /api/santvaani-space/posts/:postId/comments

// Update comment
PUT /api/santvaani-space/posts/:postId/comments/:commentId

// Delete comment
DELETE /api/santvaani-space/posts/:postId/comments/:commentId
```

---

## Component Structure

### Frontend Components

```
frontend/src/
├── pages/
│   └── santvaani-space/
│       ├── index.tsx           # Main feed page
│       └── [postId].tsx        # Post detail page
├── components/
│   └── santvaani-space/
│       ├── PostCard.tsx        # Individual post card in feed
│       ├── PostDetail.tsx      # Full post view
│       ├── LikeButton.tsx      # Like button with animation
│       ├── CommentSection.tsx  # Comments UI
│       ├── CommentInput.tsx    # Add comment form
│       └── ShareButton.tsx     # Share functionality
```

### Admin Components

```
admin/src/
├── pages/
│   └── SantVaaniSpace.tsx      # Posts management page
├── components/
│   ├── SpacePostForm.tsx       # Create/Edit post form
│   ├── SpacePostsList.tsx      # Posts table
│   └── SpaceAnalytics.tsx      # Engagement stats
```

---

## Implementation Plan

### Phase 1: Database & Backend (Day 1)
1. ✅ Create database tables (spiritual_posts, post_likes, post_comments)
2. ✅ Set up RLS policies
3. ✅ Create backend API endpoints for posts
4. ✅ Create backend API endpoints for likes
5. ✅ Create backend API endpoints for comments
6. ✅ Test all endpoints

### Phase 2: Admin Panel (Day 2)
1. ✅ Create SantVaaniSpace admin page
2. ✅ Build post creation form
3. ✅ Add image upload functionality
4. ✅ Implement edit/delete functionality
5. ✅ Add analytics dashboard
6. ✅ Test admin features

### Phase 3: User Frontend - Feed (Day 3)
1. ✅ Create main feed page layout
2. ✅ Build PostCard component
3. ✅ Implement infinite scroll/pagination
4. ✅ Add like functionality with animation
5. ✅ Make it responsive
6. ✅ Test feed page

### Phase 4: User Frontend - Post Detail & Comments (Day 4)
1. ✅ Create post detail page
2. ✅ Build comment section UI
3. ✅ Implement add/delete comment
4. ✅ Add share functionality
5. ✅ Polish animations and transitions
6. ✅ Test everything

### Phase 5: Polish & Deploy (Day 5)
1. ✅ Add bilingual support
2. ✅ Optimize images and performance
3. ✅ Add loading states
4. ✅ Error handling
5. ✅ Deploy to production
6. ✅ Final testing

---

## Design Guidelines

### Colors
- Primary: Orange (#ea580c) - SantVaani brand color
- Secondary: Purple (#9333ea) - Spiritual vibe
- Gradients: Use same gradient combinations as quotes page
- Background: White/Light gray
- Text: Dark gray for content, Orange for CTAs

### Typography
- Headings: Bold, large (24-32px)
- Content: Regular, readable (16-18px)
- Hindi text: Slightly larger for better readability

### Animations
- Like button: Heart scale + confetti on click
- Cards: Smooth hover effect with shadow
- Comments: Slide in from bottom
- Loading: Skeleton screens
- Page transitions: Fade in

### Responsive Design
- Mobile first approach
- Single column on mobile
- 2-3 columns on tablet
- Grid layout on desktop
- Touch-friendly buttons (min 44px)

---

## Image Requirements

### Post Images
- Recommended size: 1200x630px (Facebook OG size)
- Max file size: 2MB
- Supported formats: JPG, PNG, WebP
- Aspect ratio: 16:9 or 1:1
- Storage: Supabase Storage or Cloudinary

### Image Upload Flow
1. Admin selects image
2. Client-side validation (size, format)
3. Upload to storage
4. Get public URL
5. Save URL in database
6. Display in post

---

## Categories

```javascript
const categories = [
  'Daily Wisdom',
  'Bhagavad Gita',
  'Festivals',
  'Stories',
  'Teachings',
  'Meditation',
  'Prayer',
  'Saints',
  'Devotional',
  'General'
]
```

---

## Sample Data

### Sample Post
```json
{
  "id": "uuid",
  "title": "The Path of Devotion",
  "title_hi": "भक्ति का मार्ग",
  "content": "True devotion is not about rituals, but about surrendering your heart to the divine. When you love unconditionally, you find peace.",
  "content_hi": "सच्ची भक्ति कर्मकांड के बारे में नहीं है, बल्कि अपने हृदय को परमात्मा को समर्पित करने के बारे में है। जब आप बिना शर्त प्रेम करते हैं, तो आपको शांति मिलती है।",
  "image_url": "https://example.com/devotion.jpg",
  "category": "Devotional",
  "likes_count": 245,
  "comments_count": 18,
  "is_published": true,
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

## Authentication Flow

### For Likes & Comments
1. User clicks like/comment
2. Check if user is authenticated
3. If not authenticated:
   - Show "Sign in to like/comment" message
   - Redirect to auth page
4. If authenticated:
   - Perform action
   - Update UI optimistically
   - Show success feedback

### Anonymous Users
- Can view posts and feed
- Cannot like or comment
- See "Sign in to engage" prompts

---

## SEO Optimization

### Meta Tags for Each Post
```html
<meta property="og:title" content="{post.title}" />
<meta property="og:description" content="{post.content preview}" />
<meta property="og:image" content="{post.image_url}" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
```

### Sitemap
- Include all published posts
- Update on new post creation
- Submit to Google Search Console

---

## Performance Considerations

1. **Image Optimization**
   - Use WebP format
   - Lazy load images
   - Responsive images (srcset)
   - CDN delivery

2. **Infinite Scroll**
   - Load 10 posts at a time
   - Implement virtual scrolling for large lists
   - Cache previously loaded posts

3. **Real-time Updates**
   - Use Supabase real-time for like counts
   - Optimistic UI updates
   - Debounce like button clicks

4. **Database Queries**
   - Use indexes on frequently queried columns
   - Implement pagination
   - Cache post counts

---

## Future Enhancements (V2)

- [ ] Post scheduling
- [ ] Rich text formatting in comments
- [ ] Emoji reactions (not just likes)
- [ ] Reply to comments
- [ ] Admin moderation queue
- [ ] Report inappropriate comments
- [ ] Post categories filtering
- [ ] Search functionality
- [ ] Bookmarks/Save posts
- [ ] Push notifications for new posts
- [ ] AI-generated post suggestions
- [ ] Analytics dashboard with charts

---

## Testing Checklist

### Backend Testing
- [ ] Create post (with/without image)
- [ ] Update post
- [ ] Delete post
- [ ] Get posts with pagination
- [ ] Like/unlike post
- [ ] Add comment
- [ ] Delete comment
- [ ] Check RLS policies

### Frontend Testing
- [ ] Feed loads correctly
- [ ] Infinite scroll works
- [ ] Like animation works
- [ ] Comment section opens/closes
- [ ] Add comment works
- [ ] Delete comment works
- [ ] Share button works
- [ ] Responsive on mobile
- [ ] Images load properly
- [ ] Bilingual content displays correctly

### Admin Testing
- [ ] Create new post
- [ ] Upload image
- [ ] Edit existing post
- [ ] Delete post
- [ ] View stats
- [ ] Preview post

---

## Launch Checklist

- [ ] All database tables created
- [ ] RLS policies configured
- [ ] All API endpoints working
- [ ] Admin panel complete
- [ ] User feed page complete
- [ ] Post detail page complete
- [ ] Like/comment functionality working
- [ ] Responsive design tested
- [ ] Images optimized
- [ ] SEO meta tags added
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Production deployment
- [ ] Final QA testing

---

**Ready to build? Let's create something beautiful tomorrow! 🙏✨**
