import React from 'react';
import { Button } from '../Button';
import styles from './QuantitySelector.module.css';

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  label,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    
    if (isNaN(newValue)) {
      onChange(min);
      return;
    }
    
    if (newValue < min) {
      onChange(min);
    } else if (newValue > max) {
      onChange(max);
    } else {
      onChange(newValue);
    }
  };

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.controls}>
        <Button
          variant="outline"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className={styles.button}
          aria-label="Decrease quantity"
        >
          −
        </Button>
        
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          disabled={disabled}
          className={styles.input}
          aria-label="Quantity"
        />
        
        <Button
          variant="outline"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className={styles.button}
          aria-label="Increase quantity"
        >
          +
        </Button>
      </div>
    </div>
  );
};
