import { useState } from 'react';

interface UseQuantityOptions {
  initialValue?: number;
  min?: number;
  max?: number;
}

export const useQuantity = (options: UseQuantityOptions = {}) => {
  const { initialValue = 1, min = 1, max = 99 } = options;
  
  const [quantity, setQuantity] = useState(initialValue);

  const increment = () => {
    setQuantity((prev) => Math.min(prev + 1, max));
  };

  const decrement = () => {
    setQuantity((prev) => Math.max(prev - 1, min));
  };

  const setValue = (value: number) => {
    if (value < min) {
      setQuantity(min);
    } else if (value > max) {
      setQuantity(max);
    } else {
      setQuantity(value);
    }
  };

  const reset = () => {
    setQuantity(initialValue);
  };

  return {
    quantity,
    increment,
    decrement,
    setValue,
    reset,
    isAtMin: quantity <= min,
    isAtMax: quantity >= max,
  };
};
