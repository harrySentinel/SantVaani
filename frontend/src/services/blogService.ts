// Blog Service for SantVaani API calls
import { BlogPost, BlogCategory } from '@/types/blog';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export interface BlogResponse {
  success: boolean;
  posts: BlogPost[];
  hasMore?: boolean;
  error?: string;
}

export interface SinglePostResponse {
  success: boolean;
  post: BlogPost;
  error?: string;
}

export interface CategoryResponse {
  success: boolean;
  categories: BlogCategory[];
  error?: string;
}

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class BlogService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    console.log(`📦 Using cached data for: ${key}`);
    return entry.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async makeRequest<T>(
    endpoint: string,
    options?: RequestInit,
    retries: number = 3
  ): Promise<T> {
    // Check cache first for GET requests
    if (!options?.method || options.method === 'GET') {
      const cached = this.getCached<T>(endpoint);
      if (cached) return cached;
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          ...options,
        });

        // Handle rate limiting with exponential backoff
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '2', 10);
          const delay = Math.min(retryAfter * 1000, (attempt + 1) * 2000);

          console.warn(`⚠️ Rate limited (429). Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Cache successful GET requests
        if (!options?.method || options.method === 'GET') {
          this.setCache(endpoint, data);
        }

        return data;
      } catch (error) {
        lastError = error as Error;
        console.error(`API Error for ${endpoint} (attempt ${attempt + 1}):`, error);

        // Wait before retry (exponential backoff)
        if (attempt < retries - 1) {
          const delay = Math.min((attempt + 1) * 1000, 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  // Get latest blog posts
  async getPosts(params?: {
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
  }): Promise<BlogResponse> {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = `/api/blog/posts${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<BlogResponse>(endpoint);
  }

  // Get single blog post by slug
  async getPost(slug: string): Promise<SinglePostResponse> {
    return this.makeRequest<SinglePostResponse>(`/api/blog/posts/${slug}`);
  }

  // Get featured posts
  async getFeaturedPosts(limit: number = 2): Promise<BlogResponse> {
    return this.makeRequest<BlogResponse>(`/api/blog/featured?limit=${limit}`);
  }

  // Get blog categories
  async getCategories(): Promise<CategoryResponse> {
    return this.makeRequest<CategoryResponse>('/api/blog/categories');
  }

  // Create new blog post (admin function)
  async createPost(postData: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category_id: string;
    tags?: string[];
    reading_time?: number;
    featured?: boolean;
    spiritual_quotes?: string[];
    related_saints?: string[];
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
  }): Promise<SinglePostResponse> {
    return this.makeRequest<SinglePostResponse>('/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  // Search posts
  async searchPosts(query: string, limit: number = 10): Promise<BlogResponse> {
    return this.getPosts({ search: query, limit });
  }

  // Get posts by category
  async getPostsByCategory(categoryId: string, limit: number = 10): Promise<BlogResponse> {
    return this.getPosts({ category: categoryId, limit });
  }
}

// Export singleton instance
export const blogService = new BlogService();
export default blogService;