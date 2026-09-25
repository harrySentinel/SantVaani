import type { Metadata } from 'next';
import SignupContent from './SignupContent';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join the Santvaani community.',
  alternates: { canonical: '/signup' },
  robots: { index: false },
};

export default function SignupPage() {
  return <SignupContent />;
}
