-- =====================================================
-- Reading Progress Tracking for Divine Stories
-- =====================================================
-- This enables users to track which chapters they've read,
-- bookmark their position, and continue reading where they left off

-- 1. Create reading_progress table
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.leelaayen_books(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.leelaayen_chapters(id) ON DELETE CASCADE,

  -- Progress tracking
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'reading', 'completed')),
  reading_percentage INTEGER DEFAULT 0 CHECK (reading_percentage >= 0 AND reading_percentage <= 100),
  scroll_position INTEGER DEFAULT 0,

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one progress record per user per chapter
  UNIQUE(user_id, chapter_id)
);

-- 2. Create book_progress_summary table (aggregate view per book)
CREATE TABLE IF NOT EXISTS public.book_progress_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.leelaayen_books(id) ON DELETE CASCADE,

  -- Summary stats
  total_chapters INTEGER DEFAULT 0,
  chapters_read INTEGER DEFAULT 0,
  chapters_completed INTEGER DEFAULT 0,
  overall_progress_percentage INTEGER DEFAULT 0,

  -- Last activity
  last_chapter_read_id UUID REFERENCES public.leelaayen_chapters(id) ON DELETE SET NULL,
  last_read_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one summary per user per book
  UNIQUE(user_id, book_id)
);

-- 3. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON public.reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_book_id ON public.reading_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_chapter_id ON public.reading_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_status ON public.reading_progress(status);
CREATE INDEX IF NOT EXISTS idx_reading_progress_last_read ON public.reading_progress(last_read_at DESC);

CREATE INDEX IF NOT EXISTS idx_book_progress_summary_user_id ON public.book_progress_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_book_progress_summary_book_id ON public.book_progress_summary(book_id);

-- 4. Create function to update book progress summary
CREATE OR REPLACE FUNCTION update_book_progress_summary()
RETURNS TRIGGER AS $$
DECLARE
  v_total_chapters INTEGER;
  v_chapters_read INTEGER;
  v_chapters_completed INTEGER;
  v_progress_percentage INTEGER;
BEGIN
  -- Get total chapters for the book
  SELECT total_chapters INTO v_total_chapters
  FROM leelaayen_books
  WHERE id = NEW.book_id;

  -- Count chapters read and completed
  SELECT
    COUNT(*) FILTER (WHERE status IN ('reading', 'completed')),
    COUNT(*) FILTER (WHERE status = 'completed')
  INTO v_chapters_read, v_chapters_completed
  FROM reading_progress
  WHERE user_id = NEW.user_id AND book_id = NEW.book_id;

  -- Calculate overall progress percentage
  IF v_total_chapters > 0 THEN
    v_progress_percentage := ROUND((v_chapters_completed::NUMERIC / v_total_chapters) * 100);
  ELSE
    v_progress_percentage := 0;
  END IF;

  -- Upsert book progress summary
  INSERT INTO book_progress_summary (
    user_id,
    book_id,
    total_chapters,
    chapters_read,
    chapters_completed,
    overall_progress_percentage,
    last_chapter_read_id,
    last_read_at,
    updated_at
  ) VALUES (
    NEW.user_id,
    NEW.book_id,
    v_total_chapters,
    v_chapters_read,
    v_chapters_completed,
    v_progress_percentage,
    NEW.chapter_id,
    NEW.last_read_at,
    NOW()
  )
  ON CONFLICT (user_id, book_id)
  DO UPDATE SET
    total_chapters = v_total_chapters,
    chapters_read = v_chapters_read,
    chapters_completed = v_chapters_completed,
    overall_progress_percentage = v_progress_percentage,
    last_chapter_read_id = NEW.chapter_id,
    last_read_at = NEW.last_read_at,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger to auto-update summary on progress change
DROP TRIGGER IF EXISTS trigger_update_book_progress_summary ON public.reading_progress;
CREATE TRIGGER trigger_update_book_progress_summary
  AFTER INSERT OR UPDATE ON public.reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_book_progress_summary();

-- 6. Create function to mark chapter as reading
CREATE OR REPLACE FUNCTION mark_chapter_reading(
  p_user_id UUID,
  p_chapter_id UUID,
  p_book_id UUID,
  p_scroll_position INTEGER DEFAULT 0,
  p_reading_percentage INTEGER DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  INSERT INTO reading_progress (
    user_id,
    book_id,
    chapter_id,
    status,
    scroll_position,
    reading_percentage,
    last_read_at
  ) VALUES (
    p_user_id,
    p_book_id,
    p_chapter_id,
    'reading',
    p_scroll_position,
    p_reading_percentage,
    NOW()
  )
  ON CONFLICT (user_id, chapter_id)
  DO UPDATE SET
    status = CASE
      WHEN reading_progress.status = 'completed' THEN 'completed'
      ELSE 'reading'
    END,
    scroll_position = p_scroll_position,
    reading_percentage = p_reading_percentage,
    last_read_at = NOW(),
    updated_at = NOW();

  SELECT json_build_object(
    'success', true,
    'message', 'Progress saved'
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create function to mark chapter as completed
CREATE OR REPLACE FUNCTION mark_chapter_completed(
  p_user_id UUID,
  p_chapter_id UUID,
  p_book_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  INSERT INTO reading_progress (
    user_id,
    book_id,
    chapter_id,
    status,
    reading_percentage,
    completed_at,
    last_read_at
  ) VALUES (
    p_user_id,
    p_book_id,
    p_chapter_id,
    'completed',
    100,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id, chapter_id)
  DO UPDATE SET
    status = 'completed',
    reading_percentage = 100,
    completed_at = NOW(),
    last_read_at = NOW(),
    updated_at = NOW();

  SELECT json_build_object(
    'success', true,
    'message', 'Chapter marked as completed'
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to get user's reading progress for a book
CREATE OR REPLACE FUNCTION get_user_book_progress(
  p_user_id UUID,
  p_book_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'summary', (
      SELECT json_build_object(
        'total_chapters', total_chapters,
        'chapters_read', chapters_read,
        'chapters_completed', chapters_completed,
        'progress_percentage', overall_progress_percentage,
        'last_read_at', last_read_at
      )
      FROM book_progress_summary
      WHERE user_id = p_user_id AND book_id = p_book_id
    ),
    'chapters', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'chapter_id', chapter_id,
          'status', status,
          'reading_percentage', reading_percentage,
          'last_read_at', last_read_at,
          'completed_at', completed_at
        ) ORDER BY last_read_at DESC
      ), '[]'::json)
      FROM reading_progress
      WHERE user_id = p_user_id AND book_id = p_book_id
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Enable Row Level Security (RLS)
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_progress_summary ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies for reading_progress
CREATE POLICY "Users can view their own reading progress"
  ON public.reading_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading progress"
  ON public.reading_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress"
  ON public.reading_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading progress"
  ON public.reading_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- 11. Create RLS policies for book_progress_summary
CREATE POLICY "Users can view their own book progress summary"
  ON public.book_progress_summary
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own book progress summary"
  ON public.book_progress_summary
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own book progress summary"
  ON public.book_progress_summary
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 12. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_progress_summary TO authenticated;

-- 13. Create helpful views
CREATE OR REPLACE VIEW user_reading_stats AS
SELECT
  user_id,
  COUNT(DISTINCT book_id) as books_started,
  COUNT(*) FILTER (WHERE status = 'completed') as chapters_completed,
  COUNT(*) FILTER (WHERE status = 'reading') as chapters_in_progress,
  MAX(last_read_at) as last_activity
FROM reading_progress
GROUP BY user_id;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Reading progress tracking tables created successfully!';
  RAISE NOTICE '📚 Users can now track their chapter reading progress';
  RAISE NOTICE '🎯 Book progress summaries will be auto-calculated';
  RAISE NOTICE '🔒 Row Level Security is enabled for data privacy';
END $$;
