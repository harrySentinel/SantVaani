import { useState, useEffect, useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
  initialPage?: number;
}

export function usePagination<T>({
  items,
  itemsPerPage = 12,
  initialPage = 1,
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Reset to first page when items change (e.g., when search results change)
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const pagination = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Ensure current page is valid
    const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
    
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);
    
    // Generate visible page numbers
    const getVisiblePages = () => {
      const delta = 2; // Number of pages to show on each side
      const range = [];
      const rangeWithDots = [];
      
      // Calculate the range of pages to show
      for (
        let i = Math.max(2, validCurrentPage - delta);
        i <= Math.min(totalPages - 1, validCurrentPage + delta);
        i++
      ) {
        range.push(i);
      }
      
      // Always show first page
      if (totalPages > 0) {
        rangeWithDots.push(1);
      }
      
      // Add dots if there's a gap between first page and range
      if (range.length && range[0] > 2) {
        rangeWithDots.push('...');
      }
      
      // Add the range
      rangeWithDots.push(...range);
      
      // Add dots if there's a gap between range and last page
      if (range.length && range[range.length - 1] < totalPages - 1) {
        rangeWithDots.push('...');
      }
      
      // Always show last page (if it's different from first)
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
      
      return rangeWithDots;
    };
    
    return {
      currentPage: validCurrentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      currentItems,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
      hasNextPage: validCurrentPage < totalPages,
      hasPreviousPage: validCurrentPage > 1,
      visiblePages: getVisiblePages(),
    };
  }, [items, itemsPerPage, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(pagination.totalPages);
  };

  return {
    ...pagination,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setCurrentPage,
  };
}