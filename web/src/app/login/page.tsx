import type { Metadata } from 'next';
import LoginContent from './LoginContent';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Santvaani account.',
  alternates: { canonical: '/login' },
  robots: { index: false },
};

export default function LoginPage() {
  return <LoginContent />;
}
