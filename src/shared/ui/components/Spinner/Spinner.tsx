import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = '#007acc',
}) => {
  return (
    <div
      className={`${styles.spinner} ${styles[size]}`}
      style={{ '--color': color } as React.CSSProperties}
      role="status"
      aria-label="Loading"
    />
  );
};
