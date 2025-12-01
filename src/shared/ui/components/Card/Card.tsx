import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline' | 'dark';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  hoverable = false,
  variant = 'default',
  className = '',
}) => {
  // Mapeo de variante a nombre de clase en camelCase
  const variantClassMap: Record<string, string> = {
    primary: styles.cardPrimary,
    secondary: styles.cardSecondary,
    danger: styles.cardDanger,
    success: styles.cardSuccess,
    warning: styles.cardWarning,
    outline: styles.cardOutline,
    dark: styles.cardDark,
  };
  
  const cardClasses = [
    styles.card,
    hoverable ? styles.hoverable : '',
    variant !== 'default' ? variantClassMap[variant] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};
