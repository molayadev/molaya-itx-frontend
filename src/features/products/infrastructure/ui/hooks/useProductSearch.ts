import { useMemo, useEffect, useState } from 'react';
import { Product } from '@features/products/domain/entities/Product.entity';

export const useProductSearch = (products: Product[], searchQuery: string, debounceMs: number = 250) => {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, debounceMs]);

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return products;
    }

    const query = debouncedQuery.toLowerCase().trim();

    return products.filter((product) => {
      const brand = product.brand.toLowerCase();
      const model = product.model.toLowerCase();
      
      return brand.includes(query) || model.includes(query);
    });
  }, [products, debouncedQuery]);

  return {
    filteredProducts,
    isSearching: searchQuery !== debouncedQuery,
  };
};
