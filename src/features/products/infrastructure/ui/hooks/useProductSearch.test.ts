import { renderHook, act, waitFor } from '@testing-library/react';
import { useProductSearch } from './useProductSearch';
import { Product } from '@features/products/domain/entities/Product.entity';

const mockProducts: Product[] = [
  Object.freeze({ id: '1', brand: 'Apple', model: 'iPhone 14', price: 999, imgUrl: 'test.jpg' }),
  Object.freeze({ id: '2', brand: 'Samsung', model: 'Galaxy S23', price: 899, imgUrl: 'test.jpg' }),
  Object.freeze({ id: '3', brand: 'Apple', model: 'MacBook Pro', price: 1999, imgUrl: 'test.jpg' }),
];

describe('useProductSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return all products when query is empty', () => {
    const { result } = renderHook(() => useProductSearch(mockProducts, ''));
    expect(result.current.filteredProducts).toHaveLength(3);
    expect(result.current.filteredProducts).toEqual(mockProducts);
  });

  it('should filter by brand after debounce', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useProductSearch(mockProducts, query, 250),
      { initialProps: { query: '' } }
    );
    
    expect(result.current.filteredProducts).toHaveLength(3);
    expect(result.current.isSearching).toBe(false);

    rerender({ query: 'apple' });
    expect(result.current.isSearching).toBe(true);

    act(() => {
      jest.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(result.current.filteredProducts).toHaveLength(2);
      expect(result.current.isSearching).toBe(false);
    });
  });

  it('should filter by model after debounce', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useProductSearch(mockProducts, query, 250),
      { initialProps: { query: '' } }
    );
    
    rerender({ query: 'galaxy' });
    
    act(() => {
      jest.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].model).toBe('Galaxy S23');
    });
  });

  it('should be case insensitive', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useProductSearch(mockProducts, query, 250),
      { initialProps: { query: '' } }
    );
    
    rerender({ query: 'IPHONE' });
    
    act(() => {
      jest.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].model).toBe('iPhone 14');
    });
  });

  it('should trim whitespace from query', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useProductSearch(mockProducts, query, 250),
      { initialProps: { query: '' } }
    );
    
    rerender({ query: '  samsung  ' });
    
    act(() => {
      jest.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].brand).toBe('Samsung');
    });
  });

  it('should return empty array when no matches found', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useProductSearch(mockProducts, query, 250),
      { initialProps: { query: '' } }
    );
    
    rerender({ query: 'nokia' });
    
    act(() => {
      jest.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(result.current.filteredProducts).toHaveLength(0);
    });
  });

  it('should filter by partial matches', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useProductSearch(mockProducts, query, 250),
      { initialProps: { query: '' } }
    );
    
    rerender({ query: 'Pro' });
    
    act(() => {
      jest.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].model).toBe('MacBook Pro');
    });
  });

  it('should cancel previous debounce when query changes quickly', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useProductSearch(mockProducts, query, 250),
      { initialProps: { query: '' } }
    );
    
    rerender({ query: 'app' });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    rerender({ query: 'apple' });
    
    act(() => {
      jest.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(result.current.filteredProducts).toHaveLength(2);
    });
  });

  it('should indicate searching state correctly', () => {
    const { result, rerender } = renderHook(
      ({ query }) => useProductSearch(mockProducts, query, 250),
      { initialProps: { query: '' } }
    );
    
    expect(result.current.isSearching).toBe(false);
    
    rerender({ query: 'test' });
    expect(result.current.isSearching).toBe(true);
    
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current.isSearching).toBe(false);
  });

  it('should use custom debounce time', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useProductSearch(mockProducts, query, 500),
      { initialProps: { query: '' } }
    );
    
    rerender({ query: 'apple' });
    
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current.filteredProducts).toHaveLength(3);
    
    act(() => {
      jest.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(result.current.filteredProducts).toHaveLength(2);
    });
  });
});
