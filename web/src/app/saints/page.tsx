import type { Metadata } from 'next';
import { getSaints } from '@/lib/saints';
import SaintsGallery from './SaintsGallery';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'भारत के संत: Saints of India, जीवन परिचय और शिक्षाएं',
  description:
    'Meera Bai, Kabir Das, Tulsidas, Guru Nanak Dev Ji and more: the lives and teachings of 45 saints of India, in Hindi and English.',
  alternates: { canonical: '/saints' },
  openGraph: {
    title: 'Saints of India (भारत के संत)',
    description: 'The lives and teachings of the saints of India, in Hindi and English.',
    url: '/saints',
    locale: 'hi_IN',
  },
};

export default async function SaintsPage() {
  const saints = await getSaints();
  // The gallery doesn't need full biographies; keep the page payload small.
  const gallery = saints.map(({ id, slug, name, name_hi, region, specialty, specialty_hi, period, image_url }) => ({
    id, slug, name, name_hi, region, specialty, specialty_hi, period, image_url,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Saints of India',
    url: 'https://santvaani.com/saints',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: saints.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://santvaani.com/saints/${s.slug}`,
        name: s.name,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SaintsGallery saints={gallery} />
    </>
  );
}
