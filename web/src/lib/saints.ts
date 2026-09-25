import { cache } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Saint {
  id: string;
  slug: string;
  name: string;
  name_hi: string | null;
  period: string | null;
  region: string | null;
  specialty: string | null;
  specialty_hi: string | null;
  description: string | null;
  description_hi: string | null;
  biography: string | null;
  biography_hi: string | null;
  image_url: string | null;
}

// The saints table has no slug column, so URLs are derived from the English name
// ("Bhartṛhari" → "bhartrhari"). Renaming a saint in admin changes its URL.
export const slugify = (name: string) =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getSaints = cache(async (): Promise<Saint[]> => {
  const { data } = await supabase
    .from('saints')
    .select('id, name, name_hi, period, region, specialty, specialty_hi, description, description_hi, biography, biography_hi, image_url')
    .order('created_at', { ascending: true });

  const seen = new Map<string, number>();
  return (data ?? []).map(row => {
    const base = slugify(row.name) || row.id;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return { ...row, slug: n === 1 ? base : `${base}-${n}` } as Saint;
  });
});

export const getSaint = cache(async (slug: string) => {
  const saints = await getSaints();
  const index = saints.findIndex(s => s.slug === slug);
  if (index === -1) return null;
  const saint = saints[index];
  // Related: same region first, then the saints listed next to this one.
  const sameRegion = saints.filter(s => s.id !== saint.id && s.region && s.region === saint.region);
  const neighbours = [...saints.slice(index + 1), ...saints.slice(0, index)].filter(s => !sameRegion.includes(s));
  return { saint, related: [...sameRegion, ...neighbours].slice(0, 6) };
});
