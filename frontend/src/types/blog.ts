// Blog Types for SantVaani Spiritual Content Platform

export interface BlogSEOMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  author: BlogAuthor;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number; // in minutes
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  spiritualQuotes?: string[]; // Related spiritual quotes
  relatedSaints?: string[]; // Related saints
  viewCount?: number;
  shareCount?: number;
  seoMeta?: BlogSEOMeta;
  language?: 'hi' | 'en'; // Content language: Hindi or English
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  postCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoMeta?: BlogSEOMeta;
}

export interface BlogAuthor {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  role: string; // 'Spiritual Guide', 'Content Creator', etc.
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export interface BlogSearchFilters {
  category?: string;
  tags?: string[];
  author?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  sortBy: 'newest' | 'oldest' | 'popular' | 'reading-time';
}

export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface RelatedContent {
  saints: string[];
  quotes: string[];
  dailyGuides: string[];
  festivals: string[];
}

// Blog analytics interface
export interface BlogAnalytics {
  postId: string;
  views: number;
  uniqueViews: number;
  averageReadTime: number;
  bounceRate: number;
  shareCount: number;
  engagementScore: number;
  topReferrers: string[];
  popularSections: string[];
}