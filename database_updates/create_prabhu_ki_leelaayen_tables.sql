-- Create Prabhu Ki Leelaayen (Divine Scripture Reading) Tables
-- This feature allows users to read divine stories with beautiful book-like interface

-- Chapters Table
CREATE TABLE IF NOT EXISTS prabhu_leelaayen_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_number INTEGER NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  description_hi TEXT,
  chapter_image TEXT, -- Featured image for chapter (shown at chapter start)
  content TEXT NOT NULL, -- Full chapter content in HTML/Markdown
  content_hi TEXT NOT NULL, -- Hindi version
  read_time INTEGER DEFAULT 10, -- Estimated reading time in minutes
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chapter_number_positive CHECK (chapter_number > 0)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chapters_published ON prabhu_leelaayen_chapters(published);
CREATE INDEX IF NOT EXISTS idx_chapters_number ON prabhu_leelaayen_chapters(chapter_number);
CREATE INDEX IF NOT EXISTS idx_chapters_slug ON prabhu_leelaayen_chapters(slug);

-- User Reading Progress Table (track what users are reading)
CREATE TABLE IF NOT EXISTS prabhu_leelaayen_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Can be NULL for anonymous users (use session ID)
  session_id VARCHAR(255), -- For non-logged-in users
  chapter_id UUID REFERENCES prabhu_leelaayen_chapters(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id),
  UNIQUE(session_id, chapter_id)
);

-- Create index for progress tracking
CREATE INDEX IF NOT EXISTS idx_progress_user ON prabhu_leelaayen_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_session ON prabhu_leelaayen_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_progress_chapter ON prabhu_leelaayen_progress(chapter_id);

-- Bookmarks Table (users can bookmark favorite verses/passages)
CREATE TABLE IF NOT EXISTS prabhu_leelaayen_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  session_id VARCHAR(255),
  chapter_id UUID REFERENCES prabhu_leelaayen_chapters(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  note TEXT, -- Optional note by user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON prabhu_leelaayen_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_session ON prabhu_leelaayen_bookmarks(session_id);

-- Function to increment chapter views
CREATE OR REPLACE FUNCTION increment_chapter_views(chapter_slug VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE prabhu_leelaayen_chapters
  SET views = views + 1
  WHERE slug = chapter_slug;
END;
$$ LANGUAGE plpgsql;

-- Comments on tables
COMMENT ON TABLE prabhu_leelaayen_chapters IS 'Stores chapters of Prabhu Ki Leelaayen (Divine Scripture)';
COMMENT ON TABLE prabhu_leelaayen_progress IS 'Tracks user reading progress for each chapter';
COMMENT ON TABLE prabhu_leelaayen_bookmarks IS 'User bookmarks for favorite passages';

-- Insert sample chapter (for testing)
INSERT INTO prabhu_leelaayen_chapters (
  chapter_number,
  title,
  title_hi,
  slug,
  description,
  description_hi,
  content,
  content_hi,
  read_time,
  published
) VALUES (
  1,
  'The Divine Beginning',
  'दिव्य आरंभ',
  'chapter-1-divine-beginning',
  'The story of how divine grace descended upon the earth',
  'पृथ्वी पर दिव्य कृपा के अवतरण की कथा',
  '<p>This is sample content for Chapter 1. You can replace this with actual chapter content.</p>',
  '<p>यह अध्याय 1 के लिए नमूना सामग्री है। आप इसे वास्तविक अध्याय सामग्री से बदल सकते हैं।</p>',
  10,
  true
);

-- Verify the tables were created
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name LIKE 'prabhu_leelaayen%'
ORDER BY table_name;
