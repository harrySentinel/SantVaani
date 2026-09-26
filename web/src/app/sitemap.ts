import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { getSaints } from '@/lib/saints';
import { getDivineForms } from '@/lib/divine';
import { getBhajans } from '@/lib/bhajans';
import { getPosts, getCategories } from '@/lib/blog';
import { getLibrary } from '@/lib/leelaayen';

export const revalidate = 3600;

const BASE_URL = 'https://santvaani.com';

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'daily', priority: 1.0 },
  { path: '/saints', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/divine', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/bhajans', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/prabhu-ki-leelaayen', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.8 },
  { path: '/blog/hindi', changeFrequency: 'daily', priority: 0.75 },
  { path: '/blog/english', changeFrequency: 'daily', priority: 0.75 },
  { path: '/horoscope', changeFrequency: 'daily', priority: 0.8 },
  { path: '/daily-guide', changeFrequency: 'daily', priority: 0.7 },
  { path: '/naam-jap', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/live-bhajans', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/santvaani-space', changeFrequency: 'daily', priority: 0.6 },
  { path: '/jeevani', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/donation', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms-of-service', changeFrequency: 'yearly', priority: 0.2 },
];

interface ChapterSlugRow {
  slug: string;
  updated_at: string | null;
}

const getAllChapterSlugs = async (): Promise<ChapterSlugRow[]> => {
  const { data } = await supabase
    .from('leelaayen_chapters')
    .select('slug, updated_at')
    .eq('published', true);
  return data ?? [];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [saints, divineForms, bhajans, posts, categories, books, chapters] = await Promise.all([
    getSaints(),
    getDivineForms(),
    getBhajans(),
    getPosts(),
    getCategories(),
    getLibrary(),
    getAllChapterSlugs(),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const saintEntries: MetadataRoute.Sitemap = saints.map(s => ({
    url: `${BASE_URL}/saints/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const divineEntries: MetadataRoute.Sitemap = divineForms.map(f => ({
    url: `${BASE_URL}/divine/${f.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  const bhajanEntries: MetadataRoute.Sitemap = bhajans.map(b => ({
    url: `${BASE_URL}/bhajans/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map(p => ({
    url: `${BASE_URL}/blog/post/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : p.publishedAt ? new Date(p.publishedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter(c => c.slug)
    .map(c => ({
      url: `${BASE_URL}/blog/category/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    }));

  const bookEntries: MetadataRoute.Sitemap = books.map(b => ({
    url: `${BASE_URL}/prabhu-ki-leelaayen/book/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  const chapterEntries: MetadataRoute.Sitemap = chapters.map(c => ({
    url: `${BASE_URL}/prabhu-ki-leelaayen/read/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : now,
    changeFrequency: 'monthly',
    priority: 0.55,
  }));

  return [
    ...staticEntries,
    ...saintEntries,
    ...divineEntries,
    ...bhajanEntries,
    ...postEntries,
    ...categoryEntries,
    ...bookEntries,
    ...chapterEntries,
  ];
}
