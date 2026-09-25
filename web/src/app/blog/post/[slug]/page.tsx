import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, getRelatedPosts } from '@/lib/blog';
import BlogPostDetail from './BlogPostDetail';

export const revalidate = 300;

// Render each post on its first visit, then serve it from cache (refreshed every 5 minutes).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: PageProps<'/blog/post/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post not found' };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const url = `/blog/post/${post.slug}`;
  const images = post.featuredImage ? [{ url: post.featuredImage, alt: post.title }] : undefined;

  return {
    title: { absolute: `${title} | Santvaani` },
    description,
    keywords: post.seoMeta?.keywords?.length ? post.seoMeta.keywords : post.tags,
    authors: [{ name: post.author.name }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      locale: post.language === 'hi' ? 'hi_IN' : 'en_IN',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      section: post.category.name,
      tags: post.tags,
      ...(images ? { images } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, ...(images ? { images: [post.featuredImage!] } : {}) },
  };
}

export default async function BlogPostPage(props: PageProps<'/blog/post/[slug]'>) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();
  const relatedPosts = await getRelatedPosts(post);

  const url = `https://santvaani.com/blog/post/${post.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.featuredImage || 'https://santvaani.com/android-chrome-512x512.png',
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: post.language,
    articleSection: post.category.name,
    keywords: post.tags.join(', ') || undefined,
    author: { '@type': 'Person', name: post.author.name },
    publisher: {
      '@type': 'Organization',
      name: 'Santvaani',
      logo: { '@type': 'ImageObject', url: 'https://santvaani.com/android-chrome-512x512.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <BlogPostDetail post={post} relatedPosts={relatedPosts} />
    </>
  );
}
