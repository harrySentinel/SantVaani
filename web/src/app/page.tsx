import type { Metadata } from 'next';
import Home from './Home';

export const metadata: Metadata = {
  title: { absolute: 'Santvaani - Spiritual Wisdom, Bhajans & Indian Saints' },
  description:
    "Explore the teachings of India's greatest saints. Daily horoscopes, devotional bhajans, spiritual quotes, meditation guidance, and stories of divine wisdom — in English and Hindi.",
  keywords:
    'Indian saints, spirituality, bhajans, spiritual quotes, meditation, Hindu spirituality, daily horoscope, rashifal, spiritual community, divine wisdom, sant vaani, santvaani, vedic wisdom, kabir, meera bai, hanuman chalisa, krishna, shiva',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Santvaani - Spiritual Wisdom, Bhajans & Indian Saints',
    description: "Explore the teachings of India's greatest saints, in Hindi and English.",
    url: '/',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Santvaani',
  alternateName: 'संतवाणी',
  url: 'https://santvaani.com',
  logo: { '@type': 'ImageObject', url: 'https://santvaani.com/android-chrome-512x512.png', width: 512, height: 512 },
  description:
    "A global digital sanctuary dedicated to preserving and sharing the profound wisdom of India's greatest spiritual masters with seekers around the world.",
  sameAs: ['https://twitter.com/santvaani', 'https://facebook.com/santvaani', 'https://instagram.com/santvaani'],
  contactPoint: { '@type': 'ContactPoint', contactType: 'Customer Service', email: 'contact@santvaani.com', availableLanguage: ['English', 'Hindi'] },
  knowsAbout: ['Spirituality', 'Hinduism', 'Meditation', 'Bhajans', 'Indian Saints', 'Vedic Wisdom'],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Santvaani',
  alternateName: 'संतवाणी',
  url: 'https://santvaani.com',
  inLanguage: ['en', 'hi'],
  description: "Discover the profound teachings and divine wisdom of India's greatest saints. A digital sanctuary for spiritual seekers.",
  publisher: { '@type': 'Organization', name: 'Santvaani', logo: { '@type': 'ImageObject', url: 'https://santvaani.com/android-chrome-512x512.png' } },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://santvaani.com/?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c') }} />
      <Home />
    </>
  );
}
