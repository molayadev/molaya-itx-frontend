import React from 'react';
import { Product } from '@features/products/domain/entities/Product.entity';
import { Card, ProductImage } from '@shared/ui/components';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
  product: Product;
  onClick: (productId: string) => void;
}

const formatPrice = (price: number): string => {
  return isNaN(price) ? 'Unavailable' : `${price.toFixed(2)} €`;
};

const isUnavailable = (price: number): boolean => isNaN(price);

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const unavailable = isUnavailable(product.price);
  const cardStyle = unavailable ? styles.disabled : '';
  const hoverEffect = unavailable ? 'none' : 'zoom';
  const onClickAction = () => onClick(product.id);
  return (
    <Card className={cardStyle} hoverable onClick={onClickAction}>
      <div className={styles.imageContainer}>
        <ProductImage
          src={product.imgUrl}
          alt={`${product.brand} ${product.model}`}
          size="medium"
          hoverEffect={hoverEffect}
          backgroundColor="#ffffff"
          unavailable={unavailable}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.brand}>{product.brand}</h3>
        <p className={styles.model}>{product.model}</p>
        <p className={styles.price}>{formatPrice(product.price)}</p>
      </div>
    </Card>
  );
};
