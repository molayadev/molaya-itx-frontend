import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useProductOptions } from '../../hooks/useProductOptions';
import { useQuantity } from '../../hooks/useQuantity';
import { useCart } from '@features/cart/infrastructure/ui/CartContext';
import { createCartItem } from '@features/cart/domain/entities/CartItem.entity';
import { useDependency } from '@core/di/DIContext';
import { ServiceContainer } from '@app/di/ServiceContainer';
import { ProductImage, Spinner, Button, QuantitySelector } from '@shared/ui/components';
import { ProductSpecs } from '../../components/ProductSpecs';
import { ProductOptions } from '../../components/ProductOptions';
import styles from './ProductDetailPage.module.css';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProductDetail(id);
  const { addToCart } = useCart();
  const { logger } = useDependency<ServiceContainer>();
  
  const {
    selectedColorCode,
    selectedStorageCode,
    setSelectedColorCode,
    setSelectedStorageCode,
    getSelectedColorName,
    getSelectedStorageName,
  } = useProductOptions({
    colors: product?.options?.colors || [],
    storages: product?.options?.storages || [],
  });

  const { quantity, setValue: setQuantity } = useQuantity({ initialValue: 1 });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);

  const handleAddToCart = async () => {
    logger.info({ message: '[ProductDetailPage] handleAddToCart called', context: { product: product?.id } });
    
    if (!product) {
      logger.info({ message: '[ProductDetailPage] Validation failed, returning early' });
      return;
    }

    setIsAddingToCart(true);
    setAddToCartSuccess(false);

    try {


      logger.info({ message: '[ProductDetailPage] Selected options', context: {
        color: selectedColorCode,
        storage: selectedStorageCode,
      }});

      const cartItem = createCartItem({
        productId: product.id,
        name: `${product.brand} ${product.model}`,
        image: product.imgUrl,
        colorCode: selectedColorCode ?? 0,
        colorName: getSelectedColorName(selectedColorCode),
        storageCode: selectedStorageCode ?? 0,
        storageName: getSelectedStorageName(selectedStorageCode),
        quantity: quantity,
        price: product.price,
      });

      logger.info({ message: '[ProductDetailPage] Cart item created', context: { cartItem } });
      logger.info({ message: '[ProductDetailPage] Calling addToCart...' });
      await addToCart(cartItem);
      logger.info({ message: '[ProductDetailPage] addToCart completed successfully' });

      setAddToCartSuccess(true);
      setTimeout(() => setAddToCartSuccess(false), 3000);
    } catch (error) {
      logger.error({ message: '[ProductDetailPage] Error adding to cart', error });
    } finally {
      setIsAddingToCart(false);
    }
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
                  disabled={isAddingToCart}
                  variant="primary"
                  fullWidth
                >
                  {isAddingToCart ? 'Adding to cart...' : addToCartSuccess ? '✓ Added to cart!' : 'Add to cart'}
                </Button>

                {addToCartSuccess && (
                  <p className={styles.successMessage}>
                    Product added to cart successfully!
                  </p>
                )}
              </div>
            </>
          )}

          <ProductSpecs product={product} defaultOpen={false} />
        </div>
      </div>
    </div>
  );
};
