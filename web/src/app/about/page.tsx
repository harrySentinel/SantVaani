import type { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About Santvaani - Our Mission & Vision',
  description:
    "Learn about Santvaani's mission to preserve and share the profound wisdom of India's greatest spiritual masters. Meet our team and discover our vision for a global spiritual community.",
  alternates: { canonical: '/about' },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://santvaani.com' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://santvaani.com/about' },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }} />
      <AboutContent />
    </>
  );
}
