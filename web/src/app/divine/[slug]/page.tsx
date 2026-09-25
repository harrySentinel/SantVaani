import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDivineForm } from '@/lib/divine';
import DivineDetail from './DivineDetail';

export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

const snippet = (text: string | null, max = 155) => {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};

export async function generateMetadata(props: PageProps<'/divine/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getDivineForm(slug);
  if (!data) return { title: 'Divine form not found' };
  const { form } = data;
  const names = form.name_hi ? `${form.name_hi} (${form.name})` : form.name;
  const title = `${names}: Mantra, Meaning & Significance`;
  const description =
    snippet(form.description_hi || form.description) || `The domain, mantra and significance of ${form.name}.`;
  const url = `/divine/${form.slug}`;

  return {
    title: { absolute: `${title} | Santvaani` },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      locale: 'hi_IN',
      ...(form.image_url ? { images: [{ url: form.image_url }] } : {}),
    },
  };
}

export default async function DivineFormPage(props: PageProps<'/divine/[slug]'>) {
  const { slug } = await props.params;
  const data = await getDivineForm(slug);
  if (!data) notFound();
  const { form, related, prev, next } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: form.name,
    alternateName: form.name_hi || undefined,
    description: form.description || undefined,
    ...(form.image_url ? { image: form.image_url } : {}),
    url: `https://santvaani.com/divine/${form.slug}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Divine Forms', item: 'https://santvaani.com/divine' },
      { '@type': 'ListItem', position: 2, name: form.name, item: `https://santvaani.com/divine/${form.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <DivineDetail form={form} related={related} prev={prev} next={next} />
    </>
  );
}
