import React, { useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useProductSearch } from '../../hooks/useProductSearch';
import { usePaginatedData } from '@shared/ui/hooks';
import { ProductGrid } from '../../components/ProductGrid';
import { Spinner, InfiniteScrollTrigger } from '@shared/ui/components';
import styles from './ProductListPage.module.css';

interface LayoutContext {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext<LayoutContext>();
  const { products, isLoading, error } = useProducts();
  const { filteredProducts } = useProductSearch(products, searchQuery);
  
  const { 
    displayedItems, 
    hasMore, 
    loadMore, 
    reset,
    displayedCount,
    totalItems 
  } = usePaginatedData(filteredProducts);

  useEffect(() => {
    reset();
  }, [filteredProducts, reset]);

  const handleProductClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error al cargar productos</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {totalItems > 0 && (
          <p className={styles.resultsInfo}>
            Mostrando {displayedCount} de {totalItems} productos
          </p>
        )}

        {isLoading ? (
          <div className={styles.loading}>
            <Spinner size="large" />
            <p>Cargando productos...</p>
          </div>
        ) : (
          <>
            <ProductGrid
              products={displayedItems}
              onProductClick={handleProductClick}
            />
            <InfiniteScrollTrigger
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={false}
              loadingMessage="Cargando más productos..."
            />
          </>
        )}
      </div>
    </div>
  );
};
