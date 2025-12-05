import React from 'react';
import { RadioButton } from '../RadioButton';
import styles from './RadioGroup.module.css';

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  disabled?: boolean;
  layout?: 'horizontal' | 'vertical';
  error?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  disabled = false,
  layout = 'vertical',
  error,
}) => {
  return (
    <div className={styles.container}>
      {label && <label className={styles.groupLabel}>{label}</label>}
      
      <div className={`${styles.options} ${styles[layout]}`}>
        {options.map((option) => (
          <RadioButton
            key={`${name}-${option.value}`}
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={onChange}
            disabled={disabled || option.disabled}
          />
        ))}
      </div>
      
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
