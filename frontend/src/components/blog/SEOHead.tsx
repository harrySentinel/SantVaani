// SEO Head Component for Blog Posts and Pages
import { Helmet } from 'react-helmet-async';
import { BlogPost, BlogCategory } from '@/types/blog';

interface SEOHeadProps {
  // Page-level SEO
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  type?: 'website' | 'article';

  // Blog-specific SEO
  post?: BlogPost;
  category?: BlogCategory;

  // Open Graph & Twitter
  image?: string;
  siteName?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  type = 'website',
  post,
  category,
  image,
  siteName = 'SantVaani - Digital Ashram',
  author,
  publishedDate,
  modifiedDate
}) => {
  // Generate SEO data based on props
  const getSEOData = () => {
    if (post) {
      // Blog post SEO
      return {
        title: post.seoMeta?.title || `${post.title} | SantVaani Blog`,
        description: post.seoMeta?.description || post.excerpt,
        keywords: post.seoMeta?.keywords || post.tags,
        canonicalUrl: post.seoMeta?.canonicalUrl || `https://santvaani.com/blog/post/${post.slug}`,
        image: post.featuredImage || 'https://santvaani.com/og-blog-default.jpg',
        author: post.author.name,
        publishedDate: post.publishedAt,
        type: 'article' as const
      };
    }

    if (category) {
      // Blog category SEO
      return {
        title: category.seoMeta?.title || category.seoTitle || `${category.name} Articles | SantVaani Blog`,
        description: category.seoMeta?.description || category.seoDescription || `Explore ${category.name.toLowerCase()} articles on SantVaani. ${category.description}`,
        keywords: category.seoMeta?.keywords || [category.name.toLowerCase(), 'spiritual wisdom', 'hinduism', 'spirituality'],
        canonicalUrl: category.seoMeta?.canonicalUrl || `https://santvaani.com/blog/category/${category.slug}`,
        image: 'https://santvaani.com/og-blog-category.jpg',
        type: 'website' as const
      };
    }

    // Default page SEO
    return {
      title: title || 'SantVaani - Digital Ashram for Spiritual Wisdom',
      description: description || 'Discover ancient spiritual wisdom, saint teachings, and practical guidance for modern living. Join thousands on their spiritual journey.',
      keywords: keywords.length > 0 ? keywords : ['spiritual wisdom', 'hinduism', 'spirituality', 'meditation', 'saints', 'spiritual guidance'],
      canonicalUrl: canonicalUrl || 'https://santvaani.com',
      image: image || 'https://santvaani.com/og-default.jpg',
      author: author,
      publishedDate: publishedDate,
      type
    };
  };

  const seoData = getSEOData();

  // Schema.org structured data
  const getStructuredData = () => {
    if (post) {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.featuredImage,
        "author": {
          "@type": "Person",
          "name": post.author.name,
          "description": post.author.bio
        },
        "publisher": {
          "@type": "Organization",
          "name": "SantVaani",
          "logo": {
            "@type": "ImageObject",
            "url": "https://santvaani.com/logo.png"
          }
        },
        "datePublished": post.publishedAt,
        "dateModified": post.publishedAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": seoData.canonicalUrl
        },
        "articleSection": post.category.name,
        "keywords": post.tags.join(", "),
        "wordCount": post.content.split(' ').length,
        "timeRequired": `PT${post.readingTime}M`,
        "about": {
          "@type": "Thing",
          "name": "Spiritual Wisdom"
        }
      };
    }

    if (category) {
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${category.name} Articles`,
        "description": category.description,
        "url": seoData.canonicalUrl,
        "isPartOf": {
          "@type": "WebSite",
          "name": "SantVaani",
          "@id": "https://santvaani.com"
        },
        "about": {
          "@type": "Thing",
          "name": category.name
        }
      };
    }

    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SantVaani",
      "description": seoData.description,
      "url": "https://santvaani.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://santvaani.com/blog?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords.join(', ')} />
      <link rel="canonical" href={seoData.canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={seoData.type} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={seoData.image} />
      <meta property="og:url" content={seoData.canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.image} />

      {/* Article-specific meta tags */}
      {post && (
        <>
          <meta property="article:published_time" content={new Date(post.publishedAt).toISOString()} />
          <meta property="article:author" content={post.author.name} />
          <meta property="article:section" content={post.category.name} />
          {post.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="English" />
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>

      {/* Additional meta tags for blog posts */}
      {post && (
        <>
          <meta name="article:reading_time" content={`${post.readingTime} minutes`} />
          <meta name="article:word_count" content={post.content.split(' ').length.toString()} />
        </>
      )}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Additional performance hints */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    </Helmet>
  );
};

export default SEOHead;