import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline' | 'dark';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  className?: string;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  fullWidth = false,
  className = '',
  iconBefore,
  iconAfter,
  'aria-label': ariaLabel,
}) => {
  const buttonClasses = [
    styles.button,
    variant,
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={ariaLabel}
    >
      {iconBefore && <span className={styles.icon}>{iconBefore}</span>}
      {children}
      {iconAfter && <span className={styles.icon}>{iconAfter}</span>}
    </button>
  );
};
