import { cache } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Book {
  id: string;
  title: string;
  title_hi: string;
  slug: string;
  description: string;
  description_hi: string;
  cover_image?: string;
  author: string;
  author_hi: string;
  total_chapters: number;
  views: number;
  is_santvaani_original?: boolean;
}

export interface ChapterSummary {
  id: string;
  chapter_number: number;
  title: string;
  title_hi: string;
  slug: string;
  chapter_image?: string;
  summary?: string | null;
  summary_hi?: string | null;
  read_time: number;
  views: number;
}

export interface Chapter extends ChapterSummary {
  book_id: string;
  content: string;
  content_hi: string;
}

export interface MoreBook {
  id: string;
  title: string;
  title_hi: string;
  slug: string;
  cover_image?: string;
}

export interface BookInfo {
  title: string;
  title_hi: string;
  slug: string;
  cover_image?: string;
}

export const stripChapterPrefix = (t: string) =>
  t.replace(/^\s*(chapter|ch\.?|अध्याय)\s*[\d०-९]+\s*[:\-–—.]\s*/i, '') || t;

export const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// `cache` dedupes the lookup between generateMetadata and the page render.
export const getBookPage = cache(async (slug: string) => {
  const { data: book } = await supabase
    .from('leelaayen_books')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (!book) return null;

  const [chaptersRes, moreRes] = await Promise.all([
    supabase
      .from('leelaayen_chapters')
      .select('id, chapter_number, title, title_hi, slug, chapter_image, summary, summary_hi, read_time, views')
      .eq('book_id', book.id)
      .eq('published', true)
      .order('chapter_number', { ascending: true }),
    supabase
      .from('leelaayen_books')
      .select('id, title, title_hi, slug, cover_image')
      .eq('published', true)
      .neq('id', book.id)
      .order('views', { ascending: false })
      .limit(8),
  ]);

  // Older databases may not have the summary columns yet; retry without them.
  let chapters = chaptersRes.data as ChapterSummary[] | null;
  if (chaptersRes.error) {
    const { data } = await supabase
      .from('leelaayen_chapters')
      .select('id, chapter_number, title, title_hi, slug, chapter_image, read_time, views')
      .eq('book_id', book.id)
      .eq('published', true)
      .order('chapter_number', { ascending: true });
    chapters = data as ChapterSummary[] | null;
  }

  return {
    book: book as Book,
    chapters: chapters ?? [],
    moreBooks: (moreRes.data ?? []) as MoreBook[],
  };
});

export const getChapterPage = cache(async (slug: string) => {
  const { data: chapter } = await supabase
    .from('leelaayen_chapters')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (!chapter) return null;

  const [bookRes, nextRes, prevRes, countRes] = await Promise.all([
    supabase.from('leelaayen_books').select('title, title_hi, slug, cover_image').eq('id', chapter.book_id).maybeSingle(),
    supabase.from('leelaayen_chapters').select('*').eq('book_id', chapter.book_id).eq('published', true)
      .gt('chapter_number', chapter.chapter_number).order('chapter_number', { ascending: true }).limit(1).maybeSingle(),
    supabase.from('leelaayen_chapters').select('*').eq('book_id', chapter.book_id).eq('published', true)
      .lt('chapter_number', chapter.chapter_number).order('chapter_number', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('leelaayen_chapters').select('id', { count: 'exact', head: true }).eq('book_id', chapter.book_id).eq('published', true),
  ]);

  return {
    chapter: chapter as Chapter,
    book: bookRes.data as BookInfo | null,
    nextChapter: nextRes.data as Chapter | null,
    prevChapter: prevRes.data as Chapter | null,
    totalChapters: countRes.count ?? 0,
  };
});

export const getLibrary = cache(async () => {
  const { data } = await supabase
    .from('leelaayen_books')
    .select('id, title, title_hi, slug, description, description_hi, cover_image, author, author_hi, total_chapters, views, is_santvaani_original')
    .eq('published', true)
    .order('created_at', { ascending: true });
  return (data ?? []) as Book[];
});
