import React from 'react';
import styles from './RadioButton.module.css';

export interface RadioButtonProps {
  id: string;
  name: string;
  value: string | number;
  label: string;
  checked: boolean;
  onChange: (value: string | number) => void;
  disabled?: boolean;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  const handleChange = () => {
    if (!disabled) {
      onChange(value);
    }
  };

  return (
    <label 
      htmlFor={id} 
      className={`${styles.container} ${disabled ? styles.disabled : ''}`}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.input}
      />
      <span className={styles.radio}>
        {checked && <span className={styles.dot} />}
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
};
