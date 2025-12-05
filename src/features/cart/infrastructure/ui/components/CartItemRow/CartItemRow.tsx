import React from 'react';
import { CartItem } from '@features/cart/domain/entities/CartItem.entity';
import { QuantitySelector } from '@shared/ui/components';
import styles from './CartItemRow.module.css';

export interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ 
  item, 
  onQuantityChange,
  onRemove 
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <div className={styles.itemRow} data-testid="cart-item-row">
      <img 
        src={item.image} 
        alt={item.name}
        className={styles.image}
      />
      
      <div className={styles.details}>
        <h4 className={styles.name}>{item.name}</h4>
        <div className={styles.options}>
          <span className={styles.option}>Color: {item.colorName}</span>
          <span className={styles.option}>Almacenamiento: {item.storageName}</span>
        </div>
        <div className={styles.priceInfo}>
          <span className={styles.unitPrice}>{formatPrice(item.price)} x {item.quantity}</span>
          <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <QuantitySelector
          value={item.quantity}
          onChange={onQuantityChange}
          min={1}
          max={99}
        />
        <button 
          onClick={onRemove}
          className={styles.removeButton}
          aria-label="Eliminar producto"
          data-testid="remove-item-button"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
