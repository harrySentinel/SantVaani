import { cache } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { slugify } from '@/lib/saints';

export interface Bhajan {
  id: string;
  slug: string;
  title: string;
  title_hi: string;
  category: string;
  lyrics: string;
  lyrics_hi: string;
  meaning: string;
  author: string;
  youtube_url: string | null;
}

export const getBhajans = cache(async (): Promise<Bhajan[]> => {
  const { data } = await supabase
    .from('bhajans')
    .select('*')
    .order('created_at', { ascending: true });

  const seen = new Map<string, number>();
  return (data ?? []).map(row => {
    const base = slugify(row.title) || row.id;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return { ...row, slug: n === 1 ? base : `${base}-${n}` } as Bhajan;
  });
});

export const getBhajan = cache(async (slug: string) => {
  const bhajans = await getBhajans();
  const index = bhajans.findIndex(b => b.slug === slug);
  if (index === -1) return null;
  const bhajan = bhajans[index];
  const sameCategory = bhajans.filter(b => b.id !== bhajan.id && b.category && b.category === bhajan.category);
  const neighbours = [...bhajans.slice(index + 1), ...bhajans.slice(0, index)].filter(b => !sameCategory.includes(b));
  return {
    bhajan,
    related: [...sameCategory, ...neighbours].slice(0, 8),
    prev: bhajans[(index - 1 + bhajans.length) % bhajans.length],
    next: bhajans[(index + 1) % bhajans.length],
  };
});
