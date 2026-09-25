import type { Metadata } from 'next';
import DailyGuideContent from './DailyGuideContent';

export const metadata: Metadata = {
  title: 'Daily Spiritual Guide',
  description: "Today's Panchang, mantra, spiritual wisdom and upcoming festivals, with daily reminders.",
  alternates: { canonical: '/daily-guide' },
};

export default function DailyGuidePage() {
  return <DailyGuideContent />;
}
