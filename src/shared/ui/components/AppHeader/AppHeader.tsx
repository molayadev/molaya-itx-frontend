import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '@features/products/infrastructure/ui/components/SearchBar';
import { Badge } from '@shared/ui/components';
import styles from './AppHeader.module.css';

export interface AppHeaderProps {
  // Search functionality
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isSearching?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  
  // Cart functionality
  cartItemsCount?: number;
  onCartClick?: () => void;
  showCart?: boolean;
  
  // Branding
  appName?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  isSearching = false,
  showSearch = true,
  searchPlaceholder = 'Buscar productos...',
  cartItemsCount = 0,
  onCartClick,
  showCart = true,
  appName = '📱 ITX Store',
}) => {
  const navigate = useNavigate();

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      navigate('/cart');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
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
            <button
              className={styles.cartButton}
              onClick={handleCartClick}
              aria-label={`Carrito con ${cartItemsCount} items`}
            >
              <span className={styles.cartIcon}>🛒</span>
              {cartItemsCount > 0 && (
                <div className={styles.cartBadge}>
                  <Badge variant="primary">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </Badge>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
