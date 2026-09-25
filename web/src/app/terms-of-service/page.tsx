import type { Metadata } from 'next';
import TermsOfServiceContent from './TermsOfServiceContent';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: "Read Santvaani's terms of service governing your use of our spiritual platform.",
  alternates: { canonical: '/terms-of-service' },
};

export default function TermsOfServicePage() {
  return <TermsOfServiceContent />;
}
