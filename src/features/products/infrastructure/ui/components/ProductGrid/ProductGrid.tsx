import React from 'react';
import { Product } from '@features/products/domain/entities/Product.entity';
import { ProductCard } from '../ProductCard';
import styles from './ProductGrid.module.css';

export interface ProductGridProps {
  products: Product[];
  onProductClick: (productId: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductClick,
}) => {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};
