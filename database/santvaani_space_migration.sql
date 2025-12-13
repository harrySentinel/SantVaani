-- SantVaani Space Database Migration
-- Tables: spiritual_posts, post_likes, post_comments
-- Created: 2025-12-13

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table 1: spiritual_posts
-- =====================================================
CREATE TABLE IF NOT EXISTS spiritual_posts (
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

-- Index for faster queries on spiritual_posts
CREATE INDEX IF NOT EXISTS idx_spiritual_posts_created_at ON spiritual_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_spiritual_posts_category ON spiritual_posts(category);
CREATE INDEX IF NOT EXISTS idx_spiritual_posts_published ON spiritual_posts(is_published);

-- =====================================================
-- Table 2: post_likes
-- =====================================================
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES spiritual_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Index for faster queries on post_likes
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- =====================================================
-- Table 3: post_comments
-- =====================================================
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES spiritual_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries on post_comments
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE spiritual_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- ============ spiritual_posts policies ============

-- Anyone can view published posts
DROP POLICY IF EXISTS "Anyone can view published posts" ON spiritual_posts;
CREATE POLICY "Anyone can view published posts"
  ON spiritual_posts FOR SELECT
  USING (is_published = true);

-- Authenticated users (admins) can do everything
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON spiritual_posts;
CREATE POLICY "Authenticated users can manage posts"
  ON spiritual_posts FOR ALL
  USING (auth.uid() IS NOT NULL);

-- ============ post_likes policies ============

-- Anyone can view likes
DROP POLICY IF EXISTS "Anyone can view likes" ON post_likes;
CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  USING (true);

-- Authenticated users can insert their own likes
DROP POLICY IF EXISTS "Users can insert their own likes" ON post_likes;
CREATE POLICY "Users can insert their own likes"
  ON post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
DROP POLICY IF EXISTS "Users can delete their own likes" ON post_likes;
CREATE POLICY "Users can delete their own likes"
  ON post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============ post_comments policies ============

-- Anyone can view comments
DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;
CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  USING (true);

-- Authenticated users can create comments
DROP POLICY IF EXISTS "Authenticated users can create comments" ON post_comments;
CREATE POLICY "Authenticated users can create comments"
  ON post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
DROP POLICY IF EXISTS "Users can update their own comments" ON post_comments;
CREATE POLICY "Users can update their own comments"
  ON post_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments OR admins can delete any comment
DROP POLICY IF EXISTS "Users can delete their own comments" ON post_comments;
CREATE POLICY "Users can delete their own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- Functions for updating counts
-- =====================================================

-- Function to update likes_count when a like is added/removed
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE spiritual_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE spiritual_posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating likes_count
DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON post_likes;
CREATE TRIGGER trigger_update_post_likes_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

-- Function to update comments_count when a comment is added/removed
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE spiritual_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE spiritual_posts
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating comments_count
DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON post_comments;
CREATE TRIGGER trigger_update_post_comments_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating updated_at on spiritual_posts
DROP TRIGGER IF EXISTS trigger_update_spiritual_posts_updated_at ON spiritual_posts;
CREATE TRIGGER trigger_update_spiritual_posts_updated_at
  BEFORE UPDATE ON spiritual_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updating updated_at on post_comments
DROP TRIGGER IF EXISTS trigger_update_post_comments_updated_at ON post_comments;
CREATE TRIGGER trigger_update_post_comments_updated_at
  BEFORE UPDATE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Seed Data (Optional - for testing)
-- =====================================================

-- Insert a sample post
INSERT INTO spiritual_posts (title, title_hi, content, content_hi, category, is_published)
VALUES (
  'The Path of Devotion',
  'भक्ति का मार्ग',
  'True devotion is not about rituals, but about surrendering your heart to the divine. When you love unconditionally, you find peace.',
  'सच्ची भक्ति कर्मकांड के बारे में नहीं है, बल्कि अपने हृदय को परमात्मा को समर्पित करने के बारे में है। जब आप बिना शर्त प्रेम करते हैं, तो आपको शांति मिलती है।',
  'Devotional',
  true
) ON CONFLICT DO NOTHING;

-- =====================================================
-- Migration Complete
-- =====================================================
-- Run this SQL in your Supabase SQL editor to create all tables, indexes, and policies.
