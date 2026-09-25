import type { Metadata } from 'next';
import DashboardContent from './DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard',
  alternates: { canonical: '/dashboard' },
  robots: { index: false },
};

export default function DashboardPage() {
  return <DashboardContent />;
}
