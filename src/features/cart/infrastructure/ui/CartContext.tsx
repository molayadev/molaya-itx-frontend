import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useDependency } from '@core/di/DIContext';
import { ServiceContainer } from '@app/di/ServiceContainer';
import { CartItem, CartItemIdentifier } from '@features/cart/domain/entities/CartItem.entity';
import { AddToCart } from '@features/cart/application/use-cases/AddToCart';
import { GetCartItems } from '@features/cart/application/use-cases/GetCartItems';
import { UpdateCartItemQuantity } from '@features/cart/application/use-cases/UpdateCartItemQuantity';
import { RemoveFromCart } from '@features/cart/application/use-cases/RemoveFromCart';
import { ClearCart } from '@features/cart/application/use-cases/ClearCart';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  addToCart: (item: CartItem) => Promise<void>;
  updateQuantity: (identifier: CartItemIdentifier, quantity: number) => void;
  removeItem: (identifier: CartItemIdentifier) => void;
  clearCart: () => void;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cartRepository } = useDependency<ServiceContainer>();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const useCases = useMemo(() => ({
    addToCart: new AddToCart(cartRepository),
    getCartItems: new GetCartItems(cartRepository),
    updateItemQuantity: new UpdateCartItemQuantity(cartRepository),
    removeFromCart: new RemoveFromCart(cartRepository),
    clearCart: new ClearCart(cartRepository),
  }), [cartRepository]);

  const refreshCart = useCallback(() => {
    const cart = useCases.getCartItems.execute();
    const cartItems = cart ? cart.getItems() : [];
    setItems([...cartItems]);
  }, [useCases.getCartItems]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (item: CartItem): Promise<void> => {
    setIsLoading(true);
    try {
      await useCases.addToCart.execute(item);
      refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (identifier: CartItemIdentifier, quantity: number): void => {
    useCases.updateItemQuantity.execute(identifier, quantity);
    refreshCart();
  };

  const removeItem = (identifier: CartItemIdentifier): void => {
    useCases.removeFromCart.execute(identifier);
    refreshCart();
  };

  const clearCart = (): void => {
    useCases.clearCart.execute();
    refreshCart();
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
};
