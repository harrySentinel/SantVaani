import type { Metadata } from 'next';
import { getPosts } from '@/lib/blog';
import BlogListPage from './BlogListPage';

export const revalidate = 300;

const heading = 'Spiritual Blog';
const intro = 'Articles on bhakti, saints, meditation and inner peace, in Hindi and English.';

export const metadata: Metadata = {
  title: 'Spiritual Blog: Hindi & English Articles on Bhakti, Saints and Meditation',
  description: intro,
  alternates: { canonical: '/blog' },
  openGraph: { title: heading, description: intro, url: '/blog' },
};

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogListPage posts={posts} path="/blog" heading={heading} intro={intro} active={{}} />;
}
