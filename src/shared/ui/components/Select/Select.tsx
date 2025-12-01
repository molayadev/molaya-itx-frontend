import React from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  id: string;
  name: string;
  label?: string;
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  id,
  name,
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  fullWidth = false,
}) => {
  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${styles.select} ${error ? styles.error : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${id}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
