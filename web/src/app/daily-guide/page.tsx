import type { Metadata } from 'next';
import DailyGuideContent from './DailyGuideContent';

export const metadata: Metadata = {
  title: 'Daily Dharma — Spiritual Almanac',
  description: 'Understand the spiritual meaning of today, explore traditions, and choose a meaningful practice.',
  alternates: { canonical: '/daily-guide' },
};

export default function DailyGuidePage() {
  return <DailyGuideContent />;
}
