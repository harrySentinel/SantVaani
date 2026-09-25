import type { Metadata } from 'next';
import HoroscopeClient from './HoroscopeClient';

export const metadata: Metadata = {
  title: 'Daily Horoscope & Spiritual Guidance - Vedic Astrology',
  description:
    'Get your daily, weekly, and monthly spiritual horoscope based on Vedic astrology. Personalized guidance for all 12 zodiac signs in English and Hindi.',
  alternates: { canonical: '/horoscope' },
  openGraph: {
    title: 'Daily Horoscope & Spiritual Guidance',
    description: 'Personalized Vedic astrology guidance for all 12 zodiac signs, in English and Hindi.',
    url: '/horoscope',
  },
};

const faqItems = [
  { question: 'What is a spiritual horoscope?', answer: 'A spiritual horoscope combines Vedic astrology with spiritual guidance, offering insights into your daily, weekly, and monthly journey based on your zodiac sign and ancient wisdom.' },
  { question: 'How often is the horoscope updated?', answer: 'Daily horoscopes are updated every day, weekly horoscopes every Monday, and monthly horoscopes on the first of each month.' },
  { question: 'Which zodiac signs are covered?', answer: 'All 12 zodiac signs are covered: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, and Pisces.' },
  { question: 'Is the horoscope available in Hindi?', answer: 'Yes, all horoscope predictions are available in both English and Hindi on Santvaani.' },
];

export default function HoroscopePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <HoroscopeClient />
    </>
  );
}
