-- One-line summaries shown under each chapter title on the ebook page
ALTER TABLE leelaayen_chapters
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS summary_hi TEXT;
