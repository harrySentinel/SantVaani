import type { Metadata } from 'next';
import DailyGuideContent from './DailyGuideContent';

export const metadata: Metadata = {
  title: 'Aaj — Daily Spiritual Guide',
  description: "A quiet daily companion for spiritual significance, vrat guidance, mantra, panchang and practice.",
  alternates: { canonical: '/daily-guide' },
};

export default function DailyGuidePage() {
  return <DailyGuideContent />;
}
