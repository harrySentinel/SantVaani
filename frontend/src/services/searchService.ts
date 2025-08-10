import { supabase } from '@/lib/supabaseClient';

// ===============================================
// SEARCH TYPES & INTERFACES
// ===============================================

export interface SearchResult {
  id: string;
  type: 'saints' | 'living_saints' | 'divine_forms' | 'bhajans' | 'quotes';
  title: string;
  title_hi?: string;
  description: string;
  description_hi?: string;
  image?: string;
  category?: string;
  author?: string;
  specialty?: string;
  relevanceScore?: number;
}

export interface SearchFilters {
  type?: string;
  category?: string;
  author?: string;
  region?: string;
  domain?: string;
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
  filters: SearchFilters;
  query: string;
}

// ===============================================
// SEARCH SERVICE CLASS
// ===============================================

class SearchService {
  // Search Saints
  async searchSaints(query: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('saints')
        .select('*')
        .or(`name.ilike.%${query}%,name_hi.ilike.%${query}%,specialty.ilike.%${query}%,specialty_hi.ilike.%${query}%,region.ilike.%${query}%,description.ilike.%${query}%,description_hi.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return (data || []).map(saint => ({
        id: saint.id,
        type: 'saints' as const,
        title: saint.name || '',
        title_hi: saint.name_hi,
        description: saint.description || saint.specialty || '',
        description_hi: saint.description_hi || saint.specialty_hi,
        image: saint.image_url,
        category: saint.specialty,
        author: saint.name,
        specialty: saint.specialty
      }));
    } catch (error) {
      console.error('Error searching saints:', error);
      return [];
    }
  }

  // Search Living Saints
  async searchLivingSaints(query: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('living_saints')
        .select('*')
        .or(`name.ilike.%${query}%,name_hi.ilike.%${query}%,specialty.ilike.%${query}%,specialty_hi.ilike.%${query}%,organization.ilike.%${query}%,current_location.ilike.%${query}%,current_location_hi.ilike.%${query}%,description.ilike.%${query}%,description_hi.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return (data || []).map(saint => ({
        id: saint.id,
        type: 'living_saints' as const,
        title: saint.name || '',
        title_hi: saint.name_hi,
        description: saint.description || saint.specialty || '',
        description_hi: saint.description_hi || saint.specialty_hi,
        image: saint.image,
        category: saint.organization,
        author: saint.name,
        specialty: saint.specialty
      }));
    } catch (error) {
      console.error('Error searching living saints:', error);
      return [];
    }
  }

  // Search Divine Forms
  async searchDivineForms(query: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('divine_forms')
        .select('*')
        .or(`name.ilike.%${query}%,name_hi.ilike.%${query}%,domain.ilike.%${query}%,domain_hi.ilike.%${query}%,description.ilike.%${query}%,description_hi.ilike.%${query}%,mantra.ilike.%${query}%,significance.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return (data || []).map(form => ({
        id: form.id.toString(),
        type: 'divine_forms' as const,
        title: form.name || '',
        title_hi: form.name_hi,
        description: form.description || form.domain || '',
        description_hi: form.description_hi || form.domain_hi,
        image: form.image_url,
        category: form.domain,
        author: form.name,
        specialty: form.domain
      }));
    } catch (error) {
      console.error('Error searching divine forms:', error);
      return [];
    }
  }

  // Search Bhajans
  async searchBhajans(query: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('bhajans')
        .select('*')
        .or(`title.ilike.%${query}%,title_hi.ilike.%${query}%,category.ilike.%${query}%,author.ilike.%${query}%,lyrics.ilike.%${query}%,lyrics_hi.ilike.%${query}%,meaning.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return (data || []).map(bhajan => ({
        id: bhajan.id,
        type: 'bhajans' as const,
        title: bhajan.title || '',
        title_hi: bhajan.title_hi,
        description: bhajan.meaning || `${bhajan.category} by ${bhajan.author}`,
        description_hi: bhajan.lyrics_hi?.substring(0, 100) + '...' || '',
        image: undefined,
        category: bhajan.category,
        author: bhajan.author,
        specialty: bhajan.category
      }));
    } catch (error) {
      console.error('Error searching bhajans:', error);
      return [];
    }
  }

  // Search Quotes
  async searchQuotes(query: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .or(`text.ilike.%${query}%,text_hi.ilike.%${query}%,author.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return (data || []).map(quote => ({
        id: quote.id,
        type: 'quotes' as const,
        title: `Quote by ${quote.author || 'Unknown'}`,
        title_hi: quote.author ? `${quote.author} का उद्धरण` : 'अज्ञात का उद्धरण',
        description: quote.text || '',
        description_hi: quote.text_hi || '',
        image: undefined,
        category: quote.category,
        author: quote.author,
        specialty: quote.category
      }));
    } catch (error) {
      console.error('Error searching quotes:', error);
      return [];
    }
  }

  // Unified Search - searches all content types
  async search(options: SearchOptions): Promise<SearchResponse> {
    const { query, filters = {}, limit = 20, offset = 0 } = options;
    
    try {
      const searchPromises: Promise<SearchResult[]>[] = [];
      const itemsPerType = Math.ceil(limit / 5); // Distribute across 5 content types

      // If type filter is specified, only search that type
      if (filters.type && filters.type !== 'all') {
        switch (filters.type) {
          case 'saints':
            searchPromises.push(this.searchSaints(query, limit));
            break;
          case 'living_saints':
            searchPromises.push(this.searchLivingSaints(query, limit));
            break;
          case 'divine_forms':
            searchPromises.push(this.searchDivineForms(query, limit));
            break;
          case 'bhajans':
            searchPromises.push(this.searchBhajans(query, limit));
            break;
          case 'quotes':
            searchPromises.push(this.searchQuotes(query, limit));
            break;
        }
      } else {
        // Search all types
        searchPromises.push(
          this.searchSaints(query, itemsPerType),
          this.searchLivingSaints(query, itemsPerType),
          this.searchDivineForms(query, itemsPerType),
          this.searchBhajans(query, itemsPerType),
          this.searchQuotes(query, itemsPerType)
        );
      }

      const results = await Promise.all(searchPromises);
      const flatResults = results.flat();

      // Apply additional filters
      let filteredResults = flatResults;

      if (filters.author) {
        filteredResults = filteredResults.filter(result => 
          result.author?.toLowerCase().includes(filters.author!.toLowerCase())
        );
      }

      if (filters.category) {
        filteredResults = filteredResults.filter(result => 
          result.category?.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }

      // Sort by relevance (simple scoring based on title match)
      filteredResults.sort((a, b) => {
        const aScore = this.calculateRelevanceScore(a, query);
        const bScore = this.calculateRelevanceScore(b, query);
        return bScore - aScore;
      });

      // Apply pagination
      const paginatedResults = filteredResults.slice(offset, offset + limit);

      return {
        results: paginatedResults,
        total: filteredResults.length,
        hasMore: offset + limit < filteredResults.length,
        filters,
        query
      };

    } catch (error) {
      console.error('Error in unified search:', error);
      return {
        results: [],
        total: 0,
        hasMore: false,
        filters,
        query
      };
    }
  }

  // Calculate relevance score for sorting
  private calculateRelevanceScore(result: SearchResult, query: string): number {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    
    // Title exact match gets highest score
    if (result.title.toLowerCase().includes(lowerQuery)) score += 10;
    if (result.title_hi?.toLowerCase().includes(lowerQuery)) score += 10;
    
    // Author match
    if (result.author?.toLowerCase().includes(lowerQuery)) score += 5;
    
    // Category match
    if (result.category?.toLowerCase().includes(lowerQuery)) score += 3;
    
    // Description match
    if (result.description.toLowerCase().includes(lowerQuery)) score += 1;
    if (result.description_hi?.toLowerCase().includes(lowerQuery)) score += 1;

    return score;
  }

  // Get search suggestions
  async getSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];

    try {
      const suggestions = new Set<string>();

      // Get suggestions from different content types
      const [saints, livingSaints, divineForms, bhajans, quotes] = await Promise.all([
        this.searchSaints(query, 3),
        this.searchLivingSaints(query, 3),
        this.searchDivineForms(query, 3),
        this.searchBhajans(query, 3),
        this.searchQuotes(query, 3)
      ]);

      // Add titles as suggestions
      [...saints, ...livingSaints, ...divineForms, ...bhajans, ...quotes]
        .forEach(result => {
          suggestions.add(result.title);
          if (result.title_hi) suggestions.add(result.title_hi);
          if (result.author) suggestions.add(result.author);
        });

      return Array.from(suggestions).slice(0, 8);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  // Get popular/trending searches (mock for now)
  async getPopularSearches(): Promise<string[]> {
    return [
      'Meera Bai',
      'Krishna',
      'Hanuman Chalisa',
      'Kabir Das',
      'Radha Krishna',
      'Tulsidas',
      'Shiva',
      'Ganga Aarti',
      'Bhagavad Gita',
      'Sant Tukaram'
    ];
  }
}

// Export singleton instance
export const searchService = new SearchService();