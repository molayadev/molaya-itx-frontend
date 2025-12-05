import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  count?: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline' | 'dark';
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  max = 99,
  variant = 'primary',
  children,
}) => {
  if (children) {
    return (
      <span className={`${styles.badge} ${variant}`}>
        {children}
      </span>
    );
  }

  const displayCount = count && count > max ? `${max}+` : count;
  if (!count || count === 0) return null;

  return (
    <span className={`${styles.badge} ${variant}`}>
      {displayCount}
    </span>
  );
};
