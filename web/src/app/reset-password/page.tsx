import { Suspense } from 'react';
import type { Metadata } from 'next';
import ResetPasswordContent from './ResetPasswordContent';

export const metadata: Metadata = {
  title: 'Reset Password — Santvaani',
  alternates: { canonical: '/reset-password' },
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
