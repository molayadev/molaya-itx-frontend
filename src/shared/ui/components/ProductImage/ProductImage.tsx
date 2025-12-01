import React from 'react';
import { Spinner } from '../Spinner';
import styles from './ProductImage.module.css';

export interface ProductImageProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  onError?: () => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  size = 'medium',
  onError,
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleError = () => {
    setImgSrc('/placeholder.png');
    onError?.();
  };

  return (
    <div className={`${styles.container} ${styles[size]}`}>
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
    </div>
  );
};
