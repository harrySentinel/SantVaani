-- Create Prabhu Ki Leelaayen (Divine Scripture Reading) Tables
-- This feature allows users to read divine stories with beautiful book-like interface

-- Books Table (Mahabharat, Ramayan, etc.)
CREATE TABLE IF NOT EXISTS leelaayen_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  description_hi TEXT,
  cover_image TEXT, -- Book cover image
  author VARCHAR(255),
  author_hi VARCHAR(255),
  total_chapters INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for books
CREATE INDEX IF NOT EXISTS idx_books_published ON leelaayen_books(published);
CREATE INDEX IF NOT EXISTS idx_books_slug ON leelaayen_books(slug);

-- Chapters Table (belongs to a book)
CREATE TABLE IF NOT EXISTS leelaayen_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES leelaayen_books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL, -- Full chapter content in HTML/Markdown
  content_hi TEXT NOT NULL, -- Hindi version
  chapter_image TEXT, -- Featured image for chapter
  read_time INTEGER DEFAULT 10, -- Estimated reading time in minutes
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chapter_number_positive CHECK (chapter_number > 0),
  UNIQUE(book_id, chapter_number)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chapters_published ON leelaayen_chapters(published);
CREATE INDEX IF NOT EXISTS idx_chapters_book ON leelaayen_chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_slug ON leelaayen_chapters(slug);

-- User Reading Progress Table (track what users are reading)
CREATE TABLE IF NOT EXISTS leelaayen_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Can be NULL for anonymous users (use session ID)
  session_id VARCHAR(255), -- For non-logged-in users
  book_id UUID REFERENCES leelaayen_books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES leelaayen_chapters(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id, chapter_id),
  UNIQUE(session_id, book_id, chapter_id)
);

-- Create index for progress tracking
CREATE INDEX IF NOT EXISTS idx_progress_user ON leelaayen_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_session ON leelaayen_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_progress_book ON leelaayen_progress(book_id);

-- Bookmarks Table (users can bookmark favorite verses/passages)
CREATE TABLE IF NOT EXISTS leelaayen_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  session_id VARCHAR(255),
  book_id UUID REFERENCES leelaayen_books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES leelaayen_chapters(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  note TEXT, -- Optional note by user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON leelaayen_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_session ON leelaayen_bookmarks(session_id);

-- Function to increment book views
CREATE OR REPLACE FUNCTION increment_book_views(book_slug VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE leelaayen_books
  SET views = views + 1
  WHERE slug = book_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to increment chapter views
CREATE OR REPLACE FUNCTION increment_chapter_views(chapter_slug VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE leelaayen_chapters
  SET views = views + 1
  WHERE slug = chapter_slug;
END;
$$ LANGUAGE plpgsql;

-- Comments on tables
COMMENT ON TABLE leelaayen_books IS 'Stores books like Mahabharat, Ramayan, etc.';
COMMENT ON TABLE leelaayen_chapters IS 'Stores chapters for each book';
COMMENT ON TABLE leelaayen_progress IS 'Tracks user reading progress for each chapter';
COMMENT ON TABLE leelaayen_bookmarks IS 'User bookmarks for favorite passages';

-- Insert sample books (for testing)
INSERT INTO leelaayen_books (
  title,
  title_hi,
  slug,
  description,
  description_hi,
  author,
  author_hi,
  total_chapters,
  published
) VALUES
(
  'Mahabharat',
  'महाभारत',
  'mahabharat',
  'The great epic of ancient India, a tale of dharma, duty, and divine intervention',
  'प्राचीन भारत का महान महाकाव्य, धर्म, कर्तव्य और दिव्य हस्तक्षेप की कहानी',
  'Veda Vyasa',
  'वेद व्यास',
  18,
  true
),
(
  'Ramayan',
  'रामायण',
  'ramayan',
  'The divine story of Lord Rama, his devotion to dharma, and triumph of good over evil',
  'भगवान राम की दिव्य कथा, धर्म के प्रति उनकी भक्ति और बुराई पर अच्छाई की जीत',
  'Valmiki',
  'वाल्मीकि',
  7,
  true
);

-- Insert sample chapter for Mahabharat
INSERT INTO leelaayen_chapters (
  book_id,
  chapter_number,
  title,
  title_hi,
  slug,
  content,
  content_hi,
  read_time,
  published
) VALUES (
  (SELECT id FROM leelaayen_books WHERE slug = 'mahabharat'),
  1,
  'The Beginning',
  'आरम्भ',
  'mahabharat-chapter-1-beginning',
  '<p>This is sample content for Mahabharat Chapter 1. Replace with actual chapter content.</p>',
  '<p>यह महाभारत अध्याय 1 के लिए नमूना सामग्री है। वास्तविक अध्याय सामग्री से बदलें।</p>',
  15,
  true
);

-- Verify the tables were created
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name LIKE 'leelaayen%'
ORDER BY table_name;
