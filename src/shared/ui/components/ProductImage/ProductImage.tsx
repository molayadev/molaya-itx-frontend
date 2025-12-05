import React from 'react';
import { Spinner } from '../Spinner';
import styles from './ProductImage.module.css';

export interface ProductImageProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  onError?: () => void;
  hoverEffect?: 'zoom' | 'none';
  backgroundColor?: string;
  unavailable?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  size = 'medium',
  onError,
  hoverEffect = 'none',
  backgroundColor = '#ffffff',
  unavailable = false,
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleError = () => {
    setImgSrc('/placeholder.png');
    onError?.();
  };

  const containerClasses = [
    styles.container,
    styles[size],
    hoverEffect === 'zoom' ? styles.zoomable : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div 
      className={containerClasses}
      style={{ backgroundColor }}
    >
      {isLoading && (
        <div className={styles.spinnerWrapper}>
          <Spinner size="medium" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={styles.image}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        loading="lazy"
      />
      {unavailable && (
        <div className={styles.unavailableOverlay}>
          <span className={styles.unavailableText}>UNAVAILABLE</span>
        </div>
      )}
    </div>
  );
};
