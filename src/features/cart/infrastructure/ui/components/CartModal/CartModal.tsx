import React, { useRef, useEffect } from 'react';
import { CartItem, CartItemIdentifier } from '@features/cart/domain/entities/CartItem.entity';
import { CartItemRow } from '../CartItemRow';
import { Button } from '@shared/ui/components';
import styles from './CartModal.module.css';

export interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onQuantityChange: (identifier: CartItemIdentifier, quantity: number) => void;
  onRemoveItem: (identifier: CartItemIdentifier) => void;
  onClearCart: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  items,
  onQuantityChange,
  onRemoveItem,
  onClearCart,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = items.length === 0;

  return (
    <div className={styles.overlay} data-testid="cart-modal-overlay">
      <div className={styles.modal} ref={modalRef} data-testid="cart-modal">
        <div className={styles.header}>
          <h2 className={styles.title}>
            Carrito de Compras
            {!isEmpty && <span className={styles.count}>({totalItems})</span>}
          </h2>
          <button 
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Cerrar carrito"
            data-testid="close-modal-button"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {isEmpty ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyIcon}>🛒</p>
              <p className={styles.emptyText}>Tu carrito está vacío</p>
              <p className={styles.emptySubtext}>Agrega productos para comenzar</p>
            </div>
          ) : (
            <>
              <div className={styles.itemsList}>
                {items.map((item) => {
                  const identifier: CartItemIdentifier = {
                    productId: item.productId,
                    colorCode: item.colorCode,
                    storageCode: item.storageCode,
                  };

                  return (
                    <CartItemRow
                      key={`${item.productId}-${item.colorCode}-${item.storageCode}`}
                      item={item}
                      onQuantityChange={(quantity) => onQuantityChange(identifier, quantity)}
                      onRemove={() => onRemoveItem(identifier)}
                    />
                  );
                })}
              </div>

              <div className={styles.footer}>
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Subtotal ({totalItems} productos)</span>
                    <span className={styles.summaryValue}>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabelTotal}>Total</span>
                    <span className={styles.summaryValueTotal}>{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <Button
                    variant="secondary"
                    onClick={onClearCart}
                    fullWidth
                    data-testid="clear-cart-button"
                  >
                    Vaciar carrito
                  </Button>
                  <Button
                    variant="primary"
                    onClick={onClose}
                    fullWidth
                    data-testid="checkout-button"
                  >
                    Ir a pagar
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
