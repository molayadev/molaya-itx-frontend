import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from '../AppHeader';
import { useProducts } from '@features/products/infrastructure/ui/hooks/useProducts';
import { useProductSearch } from '@features/products/infrastructure/ui/hooks/useProductSearch';
import styles from './AppLayout.module.css';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { products } = useProducts();
  const { isSearching } = useProductSearch(products, searchQuery);

  const isProductListPage = location.pathname === '/products';
  const isCartPage = location.pathname === '/cart';

  const showSearch = isProductListPage;
  const showCart = !isCartPage;

  return (
    <div className={styles.layout}>
      <AppHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearching={isSearching}
        showSearch={showSearch}
        showCart={showCart}
      />
      
      <main className={styles.main}>
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </main>
    </div>
  );
};
