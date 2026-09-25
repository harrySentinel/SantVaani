import type { Metadata } from 'next';
import { getDivineForms } from '@/lib/divine';
import DivineGallery from './DivineGallery';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'देवी-देवता: Hindu Divine Forms, Mantras & Significance',
  description:
    'Krishna, Shiva, Durga, Ganesh, Hanuman and 190+ divine forms of Hinduism: their domains, sacred mantras, attributes and significance, in Hindi and English.',
  alternates: { canonical: '/divine' },
  openGraph: {
    title: 'Divine Forms of Hinduism (देवी-देवता)',
    description: 'Explore the divine forms of Hinduism, their mantras and significance, in Hindi and English.',
    url: '/divine',
    locale: 'hi_IN',
  },
};

export default async function DivinePage() {
  const forms = await getDivineForms();
  const gallery = forms.map(({ id, slug, name, name_hi, domain, domain_hi, image_url }) => ({
    id, slug, name, name_hi, domain, domain_hi, image_url,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Divine Forms of Hinduism',
    url: 'https://santvaani.com/divine',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: forms.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://santvaani.com/divine/${f.slug}`,
        name: f.name,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <DivineGallery forms={gallery} />
    </>
  );
}
