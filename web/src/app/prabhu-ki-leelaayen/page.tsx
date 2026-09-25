import type { Metadata } from 'next';
import { getLibrary } from '@/lib/leelaayen';
import Library from './Library';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Divine Stories (प्रभु की लीलाएं): Sacred Stories of Saints',
  description:
    'Read sacred stories of saints and the divine, chapter by chapter, in Hindi and English. Kabir Das and more, from Santvaani.',
  alternates: { canonical: '/prabhu-ki-leelaayen' },
  openGraph: {
    title: 'Divine Stories (प्रभु की लीलाएं)',
    description: 'Sacred stories of saints and the divine, in Hindi and English.',
    url: '/prabhu-ki-leelaayen',
  },
};

export default async function LibraryPage() {
  const books = await getLibrary();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Divine Stories',
    url: 'https://santvaani.com/prabhu-ki-leelaayen',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: books.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://santvaani.com/prabhu-ki-leelaayen/book/${b.slug}`,
        name: b.title,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <Library books={books} />
    </>
  );
}
