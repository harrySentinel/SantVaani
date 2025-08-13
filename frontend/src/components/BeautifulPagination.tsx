import React from 'react';
import { motion } from 'framer-motion';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast } from 'lucide-react';

interface BeautifulPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  visiblePages: (number | string)[];
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  showStats?: boolean;
  showFirstLast?: boolean;
  className?: string;
}

export default function BeautifulPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
  hasNextPage,
  hasPreviousPage,
  visiblePages,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = false, // Disable by default
  showStats = true,
  showFirstLast = true,
  className = '',
}: BeautifulPaginationProps) {
  // Don't render if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center space-y-4 py-8 ${className}`}
    >
      {/* Stats */}
      {showStats && (
        <div className="text-sm text-gray-600 text-center">
          Showing <span className="font-semibold text-orange-600">{startIndex}</span> to{' '}
          <span className="font-semibold text-orange-600">{endIndex}</span> of{' '}
          <span className="font-semibold text-orange-600">{totalItems}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination className="justify-center">
        <PaginationContent className="gap-1">
          {/* First Page Button */}
          {showFirstLast && totalPages > 5 && (
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={!hasPreviousPage}
                className="h-10 w-10 p-0 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 hover:border-orange-200"
              >
                <ChevronFirst className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
            </PaginationItem>
          )}

          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (hasPreviousPage) onPageChange(currentPage - 1);
              }}
              className={`h-10 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 ${
                !hasPreviousPage ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {visiblePages.map((page, index) => (
            <PaginationItem key={`${page}-${index}`}>
              {page === '...' ? (
                <PaginationEllipsis className="text-gray-400" />
              ) : (
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page as number);
                  }}
                  isActive={page === currentPage}
                  className={`h-10 w-10 border ${
                    page === currentPage
                      ? 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700'
                      : 'border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                  }`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (hasNextPage) onPageChange(currentPage + 1);
              }}
              className={`h-10 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 ${
                !hasNextPage ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            />
          </PaginationItem>

          {/* Last Page Button */}
          {showFirstLast && totalPages > 5 && (
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                disabled={!hasNextPage}
                className="h-10 w-10 p-0 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 hover:border-orange-200"
              >
                <ChevronLast className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </motion.div>
  );
}