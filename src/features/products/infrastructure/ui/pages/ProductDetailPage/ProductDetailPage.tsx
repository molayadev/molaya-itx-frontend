import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useProductOptions } from '../../hooks/useProductOptions';
import { useQuantity } from '../../hooks/useQuantity';
import { ProductImage, Spinner, Button, QuantitySelector } from '@shared/ui/components';
import { ProductSpecs } from '../../components/ProductSpecs';
import { ProductOptions } from '../../components/ProductOptions';
import styles from './ProductDetailPage.module.css';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProductDetail(id);
  
  const {
    selectedColorCode,
    selectedStorageCode,
    setSelectedColorCode,
    setSelectedStorageCode,
    isSelectionComplete,
  } = useProductOptions({
    colors: product?.options.colors || [],
    storages: product?.options.storages || [],
  });

  const { quantity, setValue: setQuantity } = useQuantity({ initialValue: 1 });
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!product || !isSelectionComplete) return;

    setIsAddingToCart(true);

    console.log('Add to cart:', {
      productId: product.id,
      colorCode: selectedColorCode,
      storageCode: selectedStorageCode,
      quantity,
    });

    setTimeout(() => {
      setIsAddingToCart(false);
      alert(`Added ${quantity} item(s) to cart!`);
    }, 1000);
  };

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error loading product</h2>
        <p>{error}</p>
        <Link to="/products">
          <Button variant="primary">Back to products</Button>
        </Link>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className={styles.loading}>
        <Spinner size="large" />
        <p>Loading product...</p>
      </div>
    );
  }

  const isProductUnavailable = !product.price || product.price === 0;

  return (
    <div className={styles.page}>
      <Link to="/products" className={styles.backLink}>
        ← Back to products
      </Link>

      <div className={styles.content}>
        <div className={styles.imageColumn}>
          <ProductImage
            src={product.imgUrl}
            alt={`${product.brand} ${product.model}`}
            size="large"
            hoverEffect="none"
            unavailable={isProductUnavailable}
          />
        </div>

        <div className={styles.detailsColumn}>
          <div className={styles.header}>
            <span className={styles.brand}>{product.brand}</span>
            <h1 className={styles.model}>{product.model}</h1>
          </div>

          {isProductUnavailable ? (
            <div className={styles.priceUnavailable}>
              <span className={styles.unavailableLabel}>Product Unavailable</span>
            </div>
          ) : (
            <div className={styles.price}>
              <span className={styles.priceLabel}>Price:</span>
              <span className={styles.priceValue}>{product.price.toFixed(2)} €</span>
            </div>
          )}

          {!isProductUnavailable && (
            <>
              <ProductOptions
                colors={product.options.colors}
                storages={product.options.storages}
                selectedColorCode={selectedColorCode}
                selectedStorageCode={selectedStorageCode}
                onColorChange={setSelectedColorCode}
                onStorageChange={setSelectedStorageCode}
              />

              <div className={styles.actions}>
                <QuantitySelector
                  label="Quantity"
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={99}
                />

                <Button
                  onClick={handleAddToCart}
                  disabled={!isSelectionComplete || isAddingToCart}
                  variant="primary"
                  fullWidth
                >
                  {isAddingToCart ? 'Adding to cart...' : 'Add to cart'}
                </Button>
              </div>
            </>
          )}

          <ProductSpecs product={product} defaultOpen={false} />
        </div>
      </div>
    </div>
  );
};
