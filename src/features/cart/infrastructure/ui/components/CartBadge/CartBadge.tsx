import React from 'react';
import { Badge } from '@shared/ui/components';
import styles from './CartBadge.module.css';

export interface CartBadgeProps {
  count: number;
  onClick?: () => void;
  maxCount?: number;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ 
  count, 
  onClick,
  maxCount = 99 
}) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  const hasItems = count > 0;

  return (
    <button 
      className={styles.cartButton} 
      onClick={onClick}
      aria-label={`Shopping Cart has ${count} products`}
      data-testid="cart-badge"
    >
      <span className={styles.cartIcon}>🛒</span>
      {hasItems && (
        <Badge 
          variant="primary"
          data-testid="cart-badge-count"
        >
          {displayCount}
        </Badge>
      )}
    </button>
  );
};
