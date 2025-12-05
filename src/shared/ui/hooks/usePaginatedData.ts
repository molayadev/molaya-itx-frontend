import { useState, useMemo, useCallback } from 'react';

const DEFAULT_PAGE_SIZE = Number(process.env.PAGE_SIZE) || 25;

export interface UsePaginatedDataOptions {
  pageSize?: number;
  initialPage?: number;
}

export interface UsePaginatedDataReturn<T> {
  displayedItems: T[];
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
  totalItems: number;
  displayedCount: number;
  currentPage: number;
}

export const usePaginatedData = <T,>(
  items: T[],
  options: UsePaginatedDataOptions = {}
): UsePaginatedDataReturn<T> => {
  const { pageSize = DEFAULT_PAGE_SIZE, initialPage = 1 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const displayedCount = currentPage * pageSize;
  const displayedItems = useMemo(() => {
    return items.slice(0, displayedCount);
  }, [items, displayedCount]);

  const hasMore = displayedCount < items.length;
  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  return {
    displayedItems,
    hasMore,
    loadMore,
    reset,
    totalItems: items.length,
    displayedCount: Math.min(displayedCount, items.length),
    currentPage,
  };
};
