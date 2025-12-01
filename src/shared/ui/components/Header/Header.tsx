import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonIcon?: string;
  onBack?: () => void;
  backTo?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  backButtonText = 'Volver',
  backButtonIcon = '←',
  onBack,
  backTo,
  children,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };
  return (
    <header className={`${styles.header} ${className}`.trim()}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          {showBackButton && (
            <button onClick={handleBack} className={styles.backButton}>
              <span className={styles.backIcon}>{backButtonIcon}</span>
              <span>{backButtonText}</span>
            </button>
          )}
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
        {children && <div className={styles.headerRight}>{children}</div>}
      </div>
    </header>
  );
};
