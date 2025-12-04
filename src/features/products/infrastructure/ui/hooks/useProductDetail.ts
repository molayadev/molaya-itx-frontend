import { useState, useEffect } from 'react';
import { ProductDetail } from '@features/products/domain/entities/Product.entity';
import { useDependency } from '@core/di';
import { GetProductById } from '@features/products/application/use-cases/GetProductById';
import { IProductRepository } from '@features/products/application/ports/IProductRepository';

interface UseProductDetailState {
  product: ProductDetail | null;
  isLoading: boolean;
  error: string | null;
}

interface Dependencies {
  productRepository: IProductRepository;
}

export const useProductDetail = (productId: string | undefined) => {
  const { productRepository } = useDependency<Dependencies>();
  const [state, setState] = useState<UseProductDetailState>(() => {
    if (!productId) {
      return {
        product: null,
        isLoading: false,
        error: 'Product ID is required',
      };
    }
    return {
      product: null,
      isLoading: true,
      error: null,
    };
  });

  useEffect(() => {
    if (!productId) {
      return;
    }

    const fetchProduct = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const useCase = new GetProductById(productRepository);
        const product = await useCase.execute(productId);

        setState({
          product,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          product: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load product',
        });
      }
    };

    fetchProduct();
  }, [productId, productRepository]);

  return state;
};
