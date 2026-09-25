import type { Metadata } from 'next';
import PostDetailContent from './PostDetailContent';

export const metadata: Metadata = {
  title: 'Santvaani Space',
};

export default function PostDetailPage() {
  return <PostDetailContent />;
}
