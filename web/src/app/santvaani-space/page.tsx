import type { Metadata } from 'next';
import SantvaaniSpaceContent from './SantvaaniSpaceContent';

export const metadata: Metadata = {
  title: 'Santvaani Space — Spiritual Social Feed',
  description: 'A spiritual social feed of devotional posts, reflections and community wisdom from Santvaani.',
  alternates: { canonical: '/santvaani-space' },
};

export default function SantvaaniSpacePage() {
  return <SantvaaniSpaceContent />;
}
