import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategory, getPosts } from '@/lib/blog';
import BlogListPage from '../../BlogListPage';

export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: PageProps<'/blog/category/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategory(slug);
  if (!category) return { title: 'Category not found' };
  const description = category.description || `Santvaani articles about ${category.name}, in Hindi and English.`;
  return {
    title: `${category.name}: Articles in Hindi & English`,
    description,
    alternates: { canonical: `/blog/category/${category.slug}` },
    openGraph: { title: category.name, description, url: `/blog/category/${category.slug}` },
  };
}

export default async function BlogCategoryPage(props: PageProps<'/blog/category/[slug]'>) {
  const { slug } = await props.params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const posts = await getPosts({ categorySlug: slug });
  return (
    <BlogListPage
      posts={posts}
      path={`/blog/category/${category.slug}`}
      heading={category.name}
      intro={category.description || `Articles about ${category.name}, in Hindi and English.`}
      active={{ category: category.slug }}
    />
  );
}
