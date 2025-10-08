import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

const SEO = ({
  title = 'SantVaani - Where Ancient Wisdom Meets Modern Hearts',
  description = 'Discover the profound teachings and divine wisdom of India\'s greatest saints. A digital sanctuary for spiritual seekers on their journey to enlightenment.',
  canonical,
  ogImage = 'https://santvaani.com/android-chrome-512x512.png',
  ogType = 'website',
  keywords = 'saints, spirituality, bhajans, Indian spirituality, meditation, spiritual wisdom, divine teachings, Hindu saints, spiritual guidance',
  author = 'SantVaani',
  publishedTime,
  modifiedTime,
  noindex = false
}: SEOProps) => {
  const url = canonical || `https://santvaani.com${window.location.pathname}`;
  const fullTitle = title.includes('SantVaani') ? title : `${title} | SantVaani`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="SantVaani" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:image:alt" content="SantVaani - Spiritual Wisdom Platform" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="hi_IN" />

      {/* Article Meta Tags (if applicable) */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:section" content="Spirituality" />
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@santvaani" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="SantVaani - Spiritual Wisdom Platform" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Mobile Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Geo Meta Tags */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
    </Helmet>
  );
};

export default SEO;
