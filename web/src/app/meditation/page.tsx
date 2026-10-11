import type { Metadata } from 'next';
import MeditationContent from './MeditationContent';

export const metadata: Metadata = {
  title: 'Meditation — A Quiet Place to Return | Santvaani',
  description: 'Begin a guided meditation with today’s mantra, a time-aware intention, and a simple practice timer from Santvaani.',
  alternates: { canonical: '/meditation' },
};

export default function MeditationPage() {
  return <MeditationContent />;
}
