import { getCategoryChips } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import BlogList from './BlogList';

interface BlogListPageProps {
  posts: BlogPost[];
  path: string;
  heading: string;
  intro: string;
  active: { language?: 'hi' | 'en'; category?: string };
}

// Server wrapper shared by /blog, /blog/hindi, /blog/english and /blog/category/[slug].
export default async function BlogListPage({ posts, path, heading, intro, active }: BlogListPageProps) {
  const categories = await getCategoryChips();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: heading,
    description: intro,
    url: `https://santvaani.com${path}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://santvaani.com/blog/post/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <BlogList posts={posts} categories={categories} active={active} heading={heading} intro={intro} />
    </>
  );
}
