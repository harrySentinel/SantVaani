import type { Metadata } from 'next';
import LiveBhajanContent from './LiveBhajanContent';

export const metadata: Metadata = {
  title: 'Live Bhajan Experience',
  description: 'Immerse yourself in divine devotional content, streaming fresh from the most sacred channels.',
  alternates: { canonical: '/live-bhajans' },
};

export default function LiveBhajanPage() {
  return <LiveBhajanContent />;
}
