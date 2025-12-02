import React, { createContext, useContext, useState } from 'react';

interface CartContextValue {
  itemCount: number;
  addToCartCount: (count: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itemCount, setItemCount] = useState(0);

  const addToCartCount = (count: number) => {
    setItemCount(count);
  };

  return (
    <CartContext.Provider value={{ itemCount, addToCartCount }}>
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
