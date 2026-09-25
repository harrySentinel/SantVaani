import { cache } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { slugify } from '@/lib/saints';

export interface DivineForm {
  id: number;
  slug: string;
  name: string;
  name_hi: string | null;
  domain: string | null;
  domain_hi: string | null;
  description: string | null;
  description_hi: string | null;
  significance: string | null;
  mantra: string | null;
  attributes: string[] | null;
  image_url: string | null;
}

export const getDivineForms = cache(async (): Promise<DivineForm[]> => {
  const { data } = await supabase
    .from('divine_forms')
    .select('*')
    .order('id');

  const seen = new Map<string, number>();
  return (data ?? []).map(row => {
    const base = slugify(row.name) || String(row.id);
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return {
      ...row,
      slug: n === 1 ? base : `${base}-${n}`,
      image_url: row.image_url ? row.image_url.trim() : null,
    } as DivineForm;
  });
});

export const getDivineForm = cache(async (slug: string) => {
  const forms = await getDivineForms();
  const index = forms.findIndex(f => f.slug === slug);
  if (index === -1) return null;
  const form = forms[index];
  const sameDomain = forms.filter(f => f.id !== form.id && f.domain && f.domain === form.domain);
  const neighbours = [...forms.slice(index + 1), ...forms.slice(0, index)].filter(f => !sameDomain.includes(f));
  return {
    form,
    related: [...sameDomain, ...neighbours].slice(0, 8),
    prev: forms[(index - 1 + forms.length) % forms.length],
    next: forms[(index + 1) % forms.length],
  };
});
