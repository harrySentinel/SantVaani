import type { Metadata } from 'next';
import DonationContent from './DonationContent';

export const metadata: Metadata = {
  title: 'Donation Support',
  description:
    'Support our mission of serving elderly citizens and orphaned children. Find and support vridh ashrams, orphanages, and dharamshalas across India.',
  alternates: { canonical: '/donation' },
};

export default function DonationPage() {
  return <DonationContent />;
}
