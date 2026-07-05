import { Helmet } from 'react-helmet-async';

// ─── Organization ───────────────────────────────────────────────────────────

interface OrganizationSchemaProps {
  type?: 'organization';
}

// ─── Website ─────────────────────────────────────────────────────────────────

interface WebsiteSchemaProps {
  type?: 'website';
}

// ─── Article ─────────────────────────────────────────────────────────────────

interface ArticleSchemaProps {
  type: 'article';
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}

// ─── Person (Saint) ──────────────────────────────────────────────────────────

interface PersonSchemaProps {
  type: 'person';
  name: string;
  alternateName?: string;
  description: string;
  image?: string;
  birthDate?: string;
  deathDate?: string;
  knowsAbout?: string[];
  sameAs?: string[];
}

// ─── FAQPage ─────────────────────────────────────────────────────────────────

interface FAQSchemaProps {
  type: 'faq';
  items: { question: string; answer: string }[];
}

// ─── MusicPlaylist ───────────────────────────────────────────────────────────

interface MusicPlaylistSchemaProps {
  type: 'musicplaylist';
  name: string;
  description?: string;
  numTracks?: number;
  tracks?: { name: string; byArtist?: string }[];
}

// ─── CollectionPage ──────────────────────────────────────────────────────────

interface CollectionPageSchemaProps {
  type: 'collectionpage';
  name: string;
  description: string;
  url: string;
}

type StructuredDataProps =
  | OrganizationSchemaProps
  | WebsiteSchemaProps
  | ArticleSchemaProps
  | PersonSchemaProps
  | FAQSchemaProps
  | MusicPlaylistSchemaProps
  | CollectionPageSchemaProps;

const StructuredData = (props: StructuredDataProps) => {
  let schema: object;

  if (!props.type || props.type === 'organization') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Santvaani',
      alternateName: 'संतवाणी',
      url: 'https://santvaani.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://santvaani.com/android-chrome-512x512.png',
        width: 512,
        height: 512,
      },
      description: "A global digital sanctuary dedicated to preserving and sharing the profound wisdom of India's greatest spiritual masters with seekers around the world.",
      sameAs: [
        'https://twitter.com/santvaani',
        'https://facebook.com/santvaani',
        'https://instagram.com/santvaani',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'contact@santvaani.com',
        availableLanguage: ['English', 'Hindi'],
      },
      knowsAbout: ['Spirituality', 'Hinduism', 'Meditation', 'Bhajans', 'Indian Saints', 'Vedic Wisdom'],
    };
  } else if (props.type === 'website') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Santvaani',
      alternateName: 'संतवाणी',
      url: 'https://santvaani.com',
      inLanguage: ['en', 'hi'],
      description: "Discover the profound teachings and divine wisdom of India's greatest saints. A digital sanctuary for spiritual seekers.",
      publisher: {
        '@type': 'Organization',
        name: 'Santvaani',
        logo: {
          '@type': 'ImageObject',
          url: 'https://santvaani.com/android-chrome-512x512.png',
        },
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://santvaani.com/?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    };
  } else if (props.type === 'article') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: props.title,
      description: props.description,
      image: props.image,
      datePublished: props.datePublished,
      dateModified: props.dateModified || props.datePublished,
      inLanguage: ['en', 'hi'],
      author: {
        '@type': 'Person',
        name: props.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Santvaani',
        logo: {
          '@type': 'ImageObject',
          url: 'https://santvaani.com/android-chrome-512x512.png',
        },
      },
    };
  } else if (props.type === 'person') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: props.name,
      ...(props.alternateName && { alternateName: props.alternateName }),
      description: props.description,
      ...(props.image && { image: props.image }),
      ...(props.birthDate && { birthDate: props.birthDate }),
      ...(props.deathDate && { deathDate: props.deathDate }),
      jobTitle: 'Spiritual Teacher',
      nationality: 'Indian',
      ...(props.knowsAbout && { knowsAbout: props.knowsAbout }),
      ...(props.sameAs && { sameAs: props.sameAs }),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://santvaani.com/saints',
      },
    };
  } else if (props.type === 'faq') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: props.items.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
  } else if (props.type === 'musicplaylist') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'MusicPlaylist',
      name: props.name,
      ...(props.description && { description: props.description }),
      ...(props.numTracks !== undefined && { numTracks: props.numTracks }),
      ...(props.tracks && {
        track: props.tracks.map(t => ({
          '@type': 'MusicRecording',
          name: t.name,
          ...(t.byArtist && { byArtist: { '@type': 'MusicGroup', name: t.byArtist } }),
          inLanguage: 'hi',
        })),
      }),
    };
  } else if (props.type === 'collectionpage') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: props.name,
      description: props.description,
      url: props.url,
      publisher: {
        '@type': 'Organization',
        name: 'Santvaani',
      },
    };
  } else {
    return null;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ─── Breadcrumb Schema ───────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  url: string;
}

export const BreadcrumbSchema = ({ items }: { items: BreadcrumbItem[] }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
