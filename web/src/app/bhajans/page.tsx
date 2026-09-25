import type { Metadata } from 'next';
import { getBhajans } from '@/lib/bhajans';
import BhajansGallery from './BhajansGallery';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'भजन के बोल: Bhajan Lyrics in Hindi & English with Meaning',
  description:
    'Hanuman Chalisa, Krishna bhajans, Shiva stotras and more: the full lyrics of devotional bhajans in Devanagari and transliteration, with their spiritual meaning.',
  alternates: { canonical: '/bhajans' },
  openGraph: {
    title: 'Bhajan Lyrics (भजन के बोल)',
    description: 'The full lyrics of devotional bhajans, aartis and stotras, in Hindi and English, with meaning.',
    url: '/bhajans',
    locale: 'hi_IN',
  },
};

export default async function BhajansPage() {
  const bhajans = await getBhajans();
  const gallery = bhajans.map(({ id, slug, title, title_hi, category, author, youtube_url }) => ({
    id, slug, title, title_hi, category, author, youtube_url,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: 'Santvaani Bhajans — Devotional Hindu Music Collection',
    description: 'A curated collection of Hindu devotional songs, bhajans, aartis, and stotras in Hindi and English.',
    url: 'https://santvaani.com/bhajans',
    numTracks: bhajans.length,
    track: bhajans.map(b => ({
      '@type': 'MusicRecording',
      name: b.title,
      url: `https://santvaani.com/bhajans/${b.slug}`,
      byArtist: { '@type': 'Person', name: b.author },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <BhajansGallery bhajans={gallery} />
    </>
  );
}
