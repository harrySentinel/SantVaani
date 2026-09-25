import { cache } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { BlogPost } from '@/types/blog';

// Reads straight from Supabase (not the Render backend) so server rendering never waits on a cold start.
// The shape matches what the backend's /api/blog endpoints returned to the legacy app.

const POST_SELECT = `*, blog_categories ( id, name, slug, icon, color, description )`;

type PostRow = Record<string, any>;

export const toBlogPost = (row: PostRow): BlogPost => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt || '',
  content: row.content || '',
  featuredImage: row.featured_image || undefined,
  category: {
    id: row.blog_categories?.id ?? '',
    name: row.blog_categories?.name ?? 'Spiritual',
    slug: row.blog_categories?.slug ?? '',
    icon: row.blog_categories?.icon ?? '',
    color: row.blog_categories?.color ?? '#f97316',
    description: row.blog_categories?.description ?? '',
  },
  tags: row.tags || [],
  author: {
    id: '1',
    name: row.author_name || 'SantVaani Team',
    bio: row.author_bio || 'Sharing spiritual wisdom with love',
    role: row.author_role || 'Spiritual Guide',
  },
  publishedAt: row.published_at,
  updatedAt: row.updated_at || undefined,
  readingTime: row.reading_time || 5,
  featured: !!row.featured,
  status: row.status,
  spiritualQuotes: row.spiritual_quotes || [],
  relatedSaints: row.related_saints || [],
  viewCount: row.view_count ?? 0,
  shareCount: row.share_count ?? 0,
  seoTitle: row.meta_title || undefined,
  seoDescription: row.meta_description || undefined,
  seoMeta: {
    title: row.meta_title || undefined,
    description: row.meta_description || undefined,
    keywords: row.meta_keywords || [],
  },
  language: row.language === 'en' ? 'en' : 'hi',
});

export const getPost = cache(async (slug: string) => {
  const { data } = await supabase
    .from('blog_posts')
    .select(POST_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data ? toBlogPost(data) : null;
});

export const getRelatedPosts = cache(async (post: BlogPost, limit = 3) => {
  const query = supabase
    .from('blog_posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(limit);
  const { data } = post.category.id ? await query.eq('category_id', post.category.id) : await query;
  return (data ?? []).map(toBlogPost);
});

export const getPosts = cache(async (opts: { language?: 'hi' | 'en'; categorySlug?: string } = {}) => {
  let categoryId: string | undefined;
  if (opts.categorySlug) {
    const { data: cat } = await supabase.from('blog_categories').select('id').eq('slug', opts.categorySlug).maybeSingle();
    if (!cat) return [];
    categoryId = cat.id;
  }
  let query = supabase.from('blog_posts').select(POST_SELECT).eq('status', 'published').order('published_at', { ascending: false });
  if (opts.language) query = query.eq('language', opts.language);
  if (categoryId) query = query.eq('category_id', categoryId);
  const { data } = await query;
  return (data ?? []).map(toBlogPost);
});

export const getCategories = cache(async () => {
  const { data } = await supabase.from('blog_categories').select('id, name, slug, icon, color, description');
  return data ?? [];
});
