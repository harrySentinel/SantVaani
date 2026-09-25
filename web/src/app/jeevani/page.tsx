import type { Metadata } from 'next';
import JeevaniContent from './JeevaniContent';

export const metadata: Metadata = {
  title: 'Premanand Ji Maharaj — Life & Teachings | Jeevani',
  description:
    'The life, teachings, and daily satsang of Premanand Ji Maharaj — a Vrindavan-based Vaishnav bhakti saint known for guiding seekers with wisdom rooted in the Bhagavad Gita and devotion to Radha-Krishna.',
  alternates: { canonical: '/jeevani' },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Premanand Ji Maharaj',
  alternateName: 'प्रेमानंद जी महाराज',
  description: 'A Vrindavan-based Vaishnav bhakti saint known for his daily satsang and spiritual guidance rooted in devotion to Radha-Krishna.',
  knowsAbout: ['Bhakti Yoga', 'Vaishnav Tradition', 'Bhagavad Gita', 'Vrindavan Spirituality'],
  url: 'https://santvaani.com/jeevani',
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://santvaani.com' },
    { '@type': 'ListItem', position: 2, name: 'Jeevani', item: 'https://santvaani.com/jeevani' },
  ],
};

export default function JeevaniPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }} />
      <JeevaniContent />
    </>
  );
}
