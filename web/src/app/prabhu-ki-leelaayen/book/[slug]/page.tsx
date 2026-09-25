import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBookPage } from '@/lib/leelaayen';
import BookDetail from './BookDetail';

export const revalidate = 300;

export async function generateMetadata(props: PageProps<'/prabhu-ki-leelaayen/book/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getBookPage(slug);
  if (!data) return { title: 'Book not found' };

  const { book } = data;
  const title = book.title_hi ? `${book.title} (${book.title_hi})` : book.title;
  const description =
    book.description?.trim() ||
    `Read ${book.title}${book.title_hi ? ` / ${book.title_hi}` : ''} on Santvaani, in Hindi and English.`;

  return {
    title: `${title}: Divine Stories`,
    description,
    alternates: { canonical: `/prabhu-ki-leelaayen/book/${book.slug}` },
    openGraph: {
      type: 'book',
      title,
      description,
      url: `/prabhu-ki-leelaayen/book/${book.slug}`,
      ...(book.cover_image ? { images: [{ url: book.cover_image, alt: book.title }] } : {}),
    },
  };
}

export default async function BookPage(props: PageProps<'/prabhu-ki-leelaayen/book/[slug]'>) {
  const { slug } = await props.params;
  const data = await getBookPage(slug);
  if (!data) notFound();

  const { book, chapters, moreBooks } = data;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    alternateName: book.title_hi || undefined,
    description: book.description || undefined,
    image: book.cover_image || undefined,
    inLanguage: ['hi', 'en'],
    author: { '@type': 'Organization', name: book.author || 'Santvaani' },
    publisher: { '@type': 'Organization', name: 'Santvaani', url: 'https://santvaani.com' },
    url: `https://santvaani.com/prabhu-ki-leelaayen/book/${book.slug}`,
    hasPart: chapters.map(ch => ({
      '@type': 'Chapter',
      name: ch.title,
      position: ch.chapter_number,
      url: `https://santvaani.com/prabhu-ki-leelaayen/read/${ch.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <BookDetail book={book} chapters={chapters} moreBooks={moreBooks} />
    </>
  );
}
