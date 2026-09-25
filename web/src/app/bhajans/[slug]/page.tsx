import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBhajan } from '@/lib/bhajans';
import BhajanDetail from './BhajanDetail';

export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

const snippet = (text: string | null, max = 155) => {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};

export async function generateMetadata(props: PageProps<'/bhajans/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getBhajan(slug);
  if (!data) return { title: 'Bhajan not found' };
  const { bhajan } = data;
  const names = bhajan.title_hi ? `${bhajan.title_hi} (${bhajan.title})` : bhajan.title;
  const title = `${names}: Lyrics & Meaning`;
  const description = snippet(bhajan.meaning) || `The full lyrics of ${bhajan.title}, in Hindi and English.`;
  const url = `/bhajans/${bhajan.slug}`;

  return {
    title: { absolute: `${title} | Santvaani` },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, locale: 'hi_IN' },
  };
}

export default async function BhajanPage(props: PageProps<'/bhajans/[slug]'>) {
  const { slug } = await props.params;
  const data = await getBhajan(slug);
  if (!data) notFound();
  const { bhajan, related, prev, next } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicComposition',
    name: bhajan.title,
    alternativeHeadline: bhajan.title_hi || undefined,
    lyrics: { '@type': 'CreativeWork', text: bhajan.lyrics_hi || bhajan.lyrics },
    composer: { '@type': 'Person', name: bhajan.author },
    genre: bhajan.category || undefined,
    url: `https://santvaani.com/bhajans/${bhajan.slug}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Bhajan Lyrics', item: 'https://santvaani.com/bhajans' },
      { '@type': 'ListItem', position: 2, name: bhajan.title, item: `https://santvaani.com/bhajans/${bhajan.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <BhajanDetail bhajan={bhajan} related={related} prev={prev} next={next} />
    </>
  );
}
