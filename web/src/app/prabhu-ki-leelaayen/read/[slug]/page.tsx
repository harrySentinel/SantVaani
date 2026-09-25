import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getChapterPage, stripChapterPrefix, stripHtml } from '@/lib/leelaayen';
import ChapterReader from './ChapterReader';

export const revalidate = 300;

export async function generateMetadata(props: PageProps<'/prabhu-ki-leelaayen/read/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getChapterPage(slug);
  if (!data) return { title: 'Chapter not found' };

  const { chapter, book } = data;
  const chapterTitle = stripChapterPrefix(chapter.title);
  const title = book ? `${chapterTitle}: ${book.title}, Chapter ${chapter.chapter_number}` : chapterTitle;
  const excerpt = stripHtml(chapter.content || '').slice(0, 155);
  const description = chapter.summary?.trim() || (excerpt ? `${excerpt}…` : `Read ${chapterTitle} on Santvaani.`);

  return {
    title,
    description,
    alternates: { canonical: `/prabhu-ki-leelaayen/read/${chapter.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/prabhu-ki-leelaayen/read/${chapter.slug}`,
      ...(book?.cover_image ? { images: [{ url: book.cover_image, alt: book.title }] } : {}),
    },
  };
}

export default async function ChapterPage(props: PageProps<'/prabhu-ki-leelaayen/read/[slug]'>) {
  const { slug } = await props.params;
  const data = await getChapterPage(slug);
  if (!data) notFound();

  const { chapter, book } = data;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: stripChapterPrefix(chapter.title),
    position: chapter.chapter_number,
    inLanguage: ['en', 'hi'],
    url: `https://santvaani.com/prabhu-ki-leelaayen/read/${chapter.slug}`,
    ...(book
      ? { isPartOf: { '@type': 'Book', name: book.title, url: `https://santvaani.com/prabhu-ki-leelaayen/book/${book.slug}` } }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      {/* Keyed by chapter so moving to the next chapter starts with fresh reader state. */}
      <ChapterReader key={chapter.id} {...data} />
    </>
  );
}
