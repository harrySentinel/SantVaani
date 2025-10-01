// Blog Service for SantVaani API calls
import { BlogPost, BlogCategory } from '@/types/blog';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

class BlogService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
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