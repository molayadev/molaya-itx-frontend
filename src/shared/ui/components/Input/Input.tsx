import React from 'react';
import styles from './Input.module.css';

export interface InputProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  type = 'text',
  fullWidth = false,
}) => {
  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`${styles.input} ${error ? styles.error : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
