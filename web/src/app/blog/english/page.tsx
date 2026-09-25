import type { Metadata } from 'next';
import { getPosts } from '@/lib/blog';
import BlogListPage from '../BlogListPage';

export const revalidate = 300;

const heading = 'Spiritual Wisdom';
const intro = 'Articles in English on bhakti, the saints of India, meditation and inner peace.';

export const metadata: Metadata = {
  title: 'Spiritual Articles in English: Bhakti, Saints and Meditation',
  description: intro,
  alternates: { canonical: '/blog/english' },
  openGraph: { title: heading, description: intro, url: '/blog/english', locale: 'en_IN' },
};

export default async function EnglishBlogPage() {
  const posts = await getPosts({ language: 'en' });
  return <BlogListPage posts={posts} path="/blog/english" heading={heading} intro={intro} active={{ language: 'en' }} />;
}
