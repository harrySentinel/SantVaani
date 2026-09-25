import type { Metadata } from 'next';
import ProfileSettingsContent from './ProfileSettingsContent';

export const metadata: Metadata = {
  title: 'Profile Settings',
  alternates: { canonical: '/profile-settings' },
  robots: { index: false },
};

export default function ProfileSettingsPage() {
  return <ProfileSettingsContent />;
}
