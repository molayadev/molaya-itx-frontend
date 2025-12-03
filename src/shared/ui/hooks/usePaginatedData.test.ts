import { renderHook, act } from '@testing-library/react';
import { usePaginatedData } from './usePaginatedData';

const createMockItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Item ${i + 1}`,
  }));
};

describe('usePaginatedData', () => {
  describe('Initial state', () => {
    it('should return first page of items by default', () => {
      const items = createMockItems(100);
      const { result } = renderHook(() => usePaginatedData(items));

      expect(result.current.displayedItems).toHaveLength(25);
      expect(result.current.displayedItems[0].id).toBe('item-1');
      expect(result.current.displayedItems[24].id).toBe('item-25');
    });

    it('should accept custom page size', () => {
      const items = createMockItems(100);
      const { result } = renderHook(() => usePaginatedData(items, { pageSize: 10 }));

      expect(result.current.displayedItems).toHaveLength(10);
      expect(result.current.displayedCount).toBe(10);
    });

    it('should start at initial page', () => {
      const items = createMockItems(100);
      const { result } = renderHook(() => usePaginatedData(items, { initialPage: 2 }));

      expect(result.current.currentPage).toBe(2);
      expect(result.current.displayedItems).toHaveLength(50); // 2 pages * 25
    });

    it('should handle empty array', () => {
      const { result } = renderHook(() => usePaginatedData([]));

      expect(result.current.displayedItems).toHaveLength(0);
      expect(result.current.hasMore).toBe(false);
      expect(result.current.totalItems).toBe(0);
    });
  });

  describe('loadMore', () => {
    it('should load next page when called', () => {
      const items = createMockItems(100);
      const { result } = renderHook(() => usePaginatedData(items, { pageSize: 25 }));

      expect(result.current.displayedItems).toHaveLength(25);

      act(() => {
        result.current.loadMore();
      });

      expect(result.current.displayedItems).toHaveLength(50);
      expect(result.current.currentPage).toBe(2);
      expect(result.current.displayedCount).toBe(50);
    });

    it('should load multiple pages sequentially', () => {
      const items = createMockItems(100);
      const { result } = renderHook(() => usePaginatedData(items, { pageSize: 20 }));

      act(() => {
        result.current.loadMore(); // Page 2
      });
      expect(result.current.displayedItems).toHaveLength(40);

      act(() => {
        result.current.loadMore(); // Page 3
      });
      expect(result.current.displayedItems).toHaveLength(60);

      act(() => {
        result.current.loadMore(); // Page 4
      });
      expect(result.current.displayedItems).toHaveLength(80);
    });

    it('should not exceed total items', () => {
      const items = createMockItems(30);
      const { result } = renderHook(() => usePaginatedData(items, { pageSize: 25 }));

      act(() => {
        result.current.loadMore();
      });

      expect(result.current.displayedItems).toHaveLength(30);
      expect(result.current.displayedCount).toBe(30);
      expect(result.current.hasMore).toBe(false);
    });

    it('should do nothing when no more items', () => {
      const items = createMockItems(25);
      const { result } = renderHook(() => usePaginatedData(items, { pageSize: 25 }));

      expect(result.current.hasMore).toBe(false);

      act(() => {
        result.current.loadMore();
      });

      expect(result.current.displayedItems).toHaveLength(25);
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('hasMore', () => {
    it('should be true when more items available', () => {
      const items = createMockItems(100);
      const { result } = renderHook(() => usePaginatedData(items, { pageSize: 25 }));

      expect(result.current.hasMore).toBe(true);
    });

    it('should be false when all items displayed', () => {
      const items = createMockItems(25);
      const { result } = renderHook(() => usePaginatedData(items, { pageSize: 25 }));

      expect(result.current.hasMore).toBe(false);
    });

    it('should be false when items less than page size', () => {
      const items = createMockItems(10);
      const { result } = renderHook(() => usePaginatedData(items, { pageSize: 25 }));

      expect(result.current.hasMore).toBe(false);
      expect(result.current.displayedItems).toHaveLength(10);
    });
  });

  describe('reset', () => {
    it('should reset to initial page', () => {
      const items = createMockItems(100);
      const { result } = renderHook(() => usePaginatedData(items, { pageSize: 20 }));

      act(() => {
        result.current.loadMore();
        result.current.loadMore();
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.displayedItems).toHaveLength(60);

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.displayedItems).toHaveLength(20);
    });

    it('should reset to custom initial page', () => {
      const items = createMockItems(100);
      const { result } = renderHook(() => 
        usePaginatedData(items, { pageSize: 10, initialPage: 2 })
      );

      act(() => {
        result.current.loadMore();
      });

      expect(result.current.currentPage).toBe(3);

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.displayedItems).toHaveLength(20);
    });
  });

  describe('totalItems and displayedCount', () => {
    it('should return correct total items', () => {
      const items = createMockItems(87);
      const { result } = renderHook(() => usePaginatedData(items));

      expect(result.current.totalItems).toBe(87);
    });

    it('should return correct displayed count', () => {
      const items = createMockItems(100);
      const { result } = renderHook(() => usePaginatedData(items, { pageSize: 30 }));

      expect(result.current.displayedCount).toBe(30);

      act(() => {
        result.current.loadMore();
      });

      expect(result.current.displayedCount).toBe(60);
    });

    it('should cap displayed count at total items', () => {
      const items = createMockItems(35);
      const { result } = renderHook(() => usePaginatedData(items, { pageSize: 25 }));

      act(() => {
        result.current.loadMore();
      });

      expect(result.current.displayedCount).toBe(35);
    });
  });

  describe('Reactivity to items changes', () => {
    it('should update when items array changes', () => {
      const items1 = createMockItems(50);
      const { result, rerender } = renderHook(
        ({ items }) => usePaginatedData(items),
        { initialProps: { items: items1 } }
      );

      expect(result.current.displayedItems).toHaveLength(25);
      expect(result.current.totalItems).toBe(50);

      const items2 = createMockItems(100);
      rerender({ items: items2 });

      expect(result.current.totalItems).toBe(100);
      expect(result.current.displayedItems).toHaveLength(25);
    });

    it('should maintain current page when items change', () => {
      const items1 = createMockItems(100);
      const { result, rerender } = renderHook(
        ({ items }) => usePaginatedData(items),
        { initialProps: { items: items1 } }
      );

      act(() => {
        result.current.loadMore();
      });

      expect(result.current.currentPage).toBe(2);

      const items2 = createMockItems(200);
      rerender({ items: items2 });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.displayedItems).toHaveLength(50);
    });
  });
});
