import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { searchService, SearchOptions, SearchResult, SearchResponse } from '@/services/searchService';

// ===============================================
// SEARCH HOOK INTERFACES
// ===============================================

interface UseSearchOptions {
  enabled?: boolean;
  debounceMs?: number;
  autoSearch?: boolean;
}

interface UseSearchReturn {
  // Data
  results: SearchResult[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Search state
  query: string;
  filters: SearchOptions['filters'];
  
  // Actions
  search: (newQuery: string, newFilters?: SearchOptions['filters']) => void;
  clearSearch: () => void;
  loadMore: () => void;
  
  // Suggestions
  suggestions: string[];
  isLoadingSuggestions: boolean;
  popularSearches: string[];
}

// ===============================================
// DEBOUNCE HOOK
// ===============================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ===============================================
// MAIN SEARCH HOOK
// ===============================================

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    enabled = true,
    debounceMs = 300,
    autoSearch = true
  } = options;

  // Local state
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchOptions['filters']>({});
  const [offset, setOffset] = useState(0);
  
  // Debounced query for API calls
  const debouncedQuery = useDebounce(query, debounceMs);
  
  const queryClient = useQueryClient();

  // Main search query
  const {
    data: searchResponse,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['search', debouncedQuery, filters, offset],
    queryFn: () => searchService.search({
      query: debouncedQuery,
      filters,
      limit: 20,
      offset
    }),
    enabled: enabled && debouncedQuery.length > 0 && autoSearch,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Suggestions query
  const {
    data: suggestions = []
  } = useQuery({
    queryKey: ['suggestions', debouncedQuery],
    queryFn: () => searchService.getSuggestions(debouncedQuery),
    enabled: enabled && debouncedQuery.length >= 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Popular searches query
  const {
    data: popularSearches = []
  } = useQuery({
    queryKey: ['popular-searches'],
    queryFn: () => searchService.getPopularSearches(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // Search action
  const search = useCallback((newQuery: string, newFilters?: SearchOptions['filters']) => {
    setQuery(newQuery);
    if (newFilters) {
      setFilters(newFilters);
    }
    setOffset(0); // Reset pagination when new search
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
    setOffset(0);
    queryClient.removeQueries(['search']);
  }, [queryClient]);

  // Load more results
  const loadMore = useCallback(() => {
    if (searchResponse?.hasMore) {
      setOffset(prev => prev + 20);
    }
  }, [searchResponse?.hasMore]);

  // Manual search (when autoSearch is false)
  const manualSearch = useCallback(async (searchQuery: string, searchFilters?: SearchOptions['filters']) => {
    if (!enabled) return;

    try {
      const response = await searchService.search({
        query: searchQuery,
        filters: searchFilters || filters,
        limit: 20,
        offset: 0
      });

      // Update React Query cache
      queryClient.setQueryData(
        ['search', searchQuery, searchFilters || filters, 0],
        response
      );

      setQuery(searchQuery);
      if (searchFilters) {
        setFilters(searchFilters);
      }
      setOffset(0);
    } catch (error) {
      console.error('Manual search failed:', error);
    }
  }, [enabled, filters, queryClient]);

  return {
    // Data
    results: searchResponse?.results || [],
    total: searchResponse?.total || 0,
    hasMore: searchResponse?.hasMore || false,
    isLoading,
    isError,
    error: error as Error | null,
    
    // Search state
    query,
    filters,
    
    // Actions
    search: autoSearch ? search : manualSearch,
    clearSearch,
    loadMore,
    
    // Suggestions
    suggestions,
    isLoadingSuggestions: false, // Suggestions load fast, no need for loading state
    popularSearches
  };
}

// ===============================================
// SEARCH FILTERS HOOK
// ===============================================

export function useSearchFilters() {
  const [filters, setFilters] = useState<SearchOptions['filters']>({});

  const updateFilter = useCallback((key: string, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters
  };
}

// ===============================================
// SEARCH HISTORY HOOK
// ===============================================

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load search history from localStorage
    const saved = localStorage.getItem('santvaani-search-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  const addToHistory = useCallback((query: string) => {
    if (!query.trim() || query.length < 2) return;

    setHistory(prev => {
      const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 10);
      localStorage.setItem('santvaani-search-history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('santvaani-search-history');
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item !== query);
      localStorage.setItem('santvaani-search-history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  };
}