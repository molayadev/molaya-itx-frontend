import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '@features/products/infrastructure/ui/components/SearchBar';
import { CartBadge } from '@features/cart/infrastructure/ui/components/CartBadge';
import { CartModal } from '@features/cart/infrastructure/ui/components/CartModal';
import { useCart } from '@features/cart/infrastructure/ui/CartContext';
import { useCartModal } from '@features/cart/infrastructure/ui/hooks';
import styles from './AppHeader.module.css';

export interface AppHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isSearching?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  showCart?: boolean;
  appName?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  isSearching = false,
  showSearch = true,
  searchPlaceholder = 'Search products...',
  showCart = true,
  appName = '📱 ITX Store',
}) => {
  const navigate = useNavigate();
  const { items, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const { isOpen, openModal, closeModal } = useCartModal();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.brand} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <h1 className={styles.logo}>{appName}</h1>
          </div>

          {showSearch && onSearchChange && (
            <div className={styles.searchContainer}>
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                isSearching={isSearching}
                placeholder={searchPlaceholder}
              />
            </div>
          )}

          {showCart && (
            <div className={styles.actions}>
              <CartBadge count={itemCount} onClick={openModal} />
            </div>
          )}
        </div>
      </header>

      <CartModal
        isOpen={isOpen}
        onClose={closeModal}
        items={items}
        onQuantityChange={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />
    </>
  );
};
