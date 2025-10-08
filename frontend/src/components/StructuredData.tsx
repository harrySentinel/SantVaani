import { Helmet } from 'react-helmet-async';

interface OrganizationSchemaProps {
  type?: 'organization';
}

interface WebsiteSchemaProps {
  type?: 'website';
}

interface ArticleSchemaProps {
  type: 'article';
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}

type StructuredDataProps = OrganizationSchemaProps | WebsiteSchemaProps | ArticleSchemaProps;

const StructuredData = (props: StructuredDataProps) => {
  let schema;

  if (!props.type || props.type === 'organization') {
    // Organization Schema
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SantVaani',
      url: 'https://santvaani.com',
      logo: 'https://santvaani.com/android-chrome-512x512.png',
      description: 'A digital sanctuary dedicated to preserving and sharing the profound wisdom of India\'s greatest spiritual masters with seekers around the world.',
      sameAs: [
        'https://twitter.com/santvaani',
        'https://facebook.com/santvaani',
        'https://instagram.com/santvaani'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'contact@santvaani.com'
      }
    };
  } else if (props.type === 'website') {
    // Website Schema
    schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SantVaani',
      url: 'https://santvaani.com',
      description: 'Discover the profound teachings and divine wisdom of India\'s greatest saints. A digital sanctuary for spiritual seekers.',
      publisher: {
        '@type': 'Organization',
        name: 'SantVaani',
        logo: {
          '@type': 'ImageObject',
          url: 'https://santvaani.com/android-chrome-512x512.png'
        }
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://santvaani.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };
  } else if (props.type === 'article') {
    // Article Schema
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: props.title,
      description: props.description,
      image: props.image,
      datePublished: props.datePublished,
      dateModified: props.dateModified || props.datePublished,
      author: {
        '@type': 'Person',
        name: props.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'SantVaani',
        logo: {
          '@type': 'ImageObject',
          url: 'https://santvaani.com/android-chrome-512x512.png'
        }
      }
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Breadcrumb Schema Component
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
      item: item.url
    }))
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
