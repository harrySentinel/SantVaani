import type { Metadata } from 'next';
import NaamJapTracker from './NaamJapTracker';

export const metadata: Metadata = {
  title: 'Naam Jap Tracker: Track Your Daily Spiritual Practice',
  description: 'Track your daily Naam Jap count, build streaks, and see your spiritual practice statistics.',
  alternates: { canonical: '/naam-jap' },
};

export default function NaamJapPage() {
  return <NaamJapTracker />;
}
