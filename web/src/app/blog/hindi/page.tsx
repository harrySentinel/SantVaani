import type { Metadata } from 'next';
import { getPosts } from '@/lib/blog';
import BlogListPage from '../BlogListPage';

export const revalidate = 300;

const heading = 'आध्यात्मिक ज्ञान';
const intro = 'भक्ति, संतों, ध्यान और आंतरिक शांति पर हिंदी में लेख। सरल ज्ञान जो जीवन को शांत और सार्थक बनाता है।';

export const metadata: Metadata = {
  title: 'आध्यात्मिक लेख हिंदी में: भक्ति, संत और ध्यान',
  description: intro,
  alternates: { canonical: '/blog/hindi' },
  openGraph: { title: heading, description: intro, url: '/blog/hindi', locale: 'hi_IN' },
};

export default async function HindiBlogPage() {
  const posts = await getPosts({ language: 'hi' });
  return <BlogListPage posts={posts} path="/blog/hindi" heading={heading} intro={intro} active={{ language: 'hi' }} />;
}
