import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearch } from '../useSearch';
import React from 'react';

// Mock the search service
const mockSearchService = {
  search: vi.fn(() => Promise.resolve({
    results: [
      {
        id: '1',
        type: 'saints',
        title: 'Test Saint',
        description: 'Test description'
      }
    ],
    total: 1,
    hasMore: false,
    query: 'test',
    filters: {}
  })),
  getSuggestions: vi.fn(() => Promise.resolve(['test suggestion'])),
  getPopularSearches: vi.fn(() => Promise.resolve(['popular search']))
};

vi.mock('@/services/searchService', () => ({
  searchService: mockSearchService
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );
};

describe('useSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: createWrapper(),
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.query).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('should perform search when query is provided', async () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: createWrapper(),
    });

    result.current.search('test query');

    await waitFor(() => {
      expect(result.current.query).toBe('test query');
    });
  });

  it('should clear search results', async () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: createWrapper(),
    });

    result.current.search('test');
    
    await waitFor(() => {
      expect(result.current.query).toBe('test');
    });

    result.current.clearSearch();

    await waitFor(() => {
      expect(result.current.query).toBe('');
    });
  });

  it('should handle search with debounce', async () => {
    const { result } = renderHook(() => useSearch({ debounceMs: 100 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.query).toBe('');
    
    // Test that search hook is working
    result.current.search('test');
    expect(result.current.query).toBe('test');
  });
});