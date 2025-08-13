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

interface BhajanPaginationProps {
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
  showStats?: boolean;
  showFirstLast?: boolean;
  className?: string;
  theme?: 'green' | 'orange' | 'purple'; // For bhajans (green) vs quotes (orange) vs divine (purple)
}

export default function BhajanPagination({
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
  showStats = true,
  showFirstLast = true,
  theme = 'green',
  className = '',
}: BhajanPaginationProps) {
  // Don't render if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  const themeColors = theme === 'green' 
    ? {
        primary: 'text-green-600',
        primaryHover: 'hover:text-green-600',
        bg: 'hover:bg-green-50',
        border: 'hover:border-green-200',
        activeBg: 'bg-green-600',
        activeHover: 'hover:bg-green-700'
      }
    : theme === 'orange'
    ? {
        primary: 'text-orange-600',
        primaryHover: 'hover:text-orange-600',
        bg: 'hover:bg-orange-50',
        border: 'hover:border-orange-200',
        activeBg: 'bg-orange-600',
        activeHover: 'hover:bg-orange-700'
      }
    : {
        primary: 'text-purple-600',
        primaryHover: 'hover:text-purple-600',
        bg: 'hover:bg-purple-50',
        border: 'hover:border-purple-200',
        activeBg: 'bg-purple-600',
        activeHover: 'hover:bg-purple-700'
      };

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
          Showing <span className={`font-semibold ${themeColors.primary}`}>{startIndex}</span> to{' '}
          <span className={`font-semibold ${themeColors.primary}`}>{endIndex}</span> of{' '}
          <span className={`font-semibold ${themeColors.primary}`}>{totalItems}</span> results
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
                className={`h-10 w-10 p-0 ${themeColors.bg} ${themeColors.primaryHover} disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 ${themeColors.border}`}
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
              className={`h-10 border border-gray-200 ${themeColors.bg} ${themeColors.primaryHover} ${themeColors.border} ${
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
                      ? `${themeColors.activeBg} text-white border-${theme === 'green' ? 'green' : theme === 'orange' ? 'orange' : 'purple'}-600 ${themeColors.activeHover}`
                      : `border-gray-200 ${themeColors.bg} ${themeColors.primaryHover} ${themeColors.border}`
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
              className={`h-10 border border-gray-200 ${themeColors.bg} ${themeColors.primaryHover} ${themeColors.border} ${
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
                className={`h-10 w-10 p-0 ${themeColors.bg} ${themeColors.primaryHover} disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 ${themeColors.border}`}
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