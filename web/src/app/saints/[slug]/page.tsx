import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSaint } from '@/lib/saints';
import SaintDetail from './SaintDetail';

export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

const snippet = (text: string | null | undefined, max = 155) => {
  const t = (text || '').replace(/\*+/g, '').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};

export async function generateMetadata(props: PageProps<'/saints/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getSaint(slug);
  if (!data) return { title: 'Saint not found' };
  const { saint } = data;

  const names = saint.name_hi ? `${saint.name_hi} (${saint.name})` : saint.name;
  const title = `${names}: जीवन परिचय, Biography & Teachings`;
  const description =
    snippet(saint.description_hi || saint.biography_hi) ||
    snippet(saint.description || saint.biography) ||
    `Life and teachings of ${saint.name}.`;
  const url = `/saints/${saint.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'profile',
      title: names,
      description,
      url,
      locale: 'hi_IN',
      ...(saint.image_url ? { images: [{ url: saint.image_url, alt: saint.name }] } : {}),
    },
  };
}

export default async function SaintPage(props: PageProps<'/saints/[slug]'>) {
  const { slug } = await props.params;
  const data = await getSaint(slug);
  if (!data) notFound();
  const { saint, related } = data;

  const url = `https://santvaani.com/saints/${saint.slug}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: saint.name,
      alternateName: saint.name_hi || undefined,
      description: saint.description?.replace(/\*+/g, '') || undefined,
      image: saint.image_url || undefined,
      knowsAbout: saint.specialty || undefined,
      homeLocation: saint.region ? { '@type': 'Place', name: saint.region } : undefined,
      url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://santvaani.com' },
        { '@type': 'ListItem', position: 2, name: 'Saints', item: 'https://santvaani.com/saints' },
        { '@type': 'ListItem', position: 3, name: saint.name, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SaintDetail saint={saint} related={related} prev={data.prev} next={data.next} />
    </>
  );
}
