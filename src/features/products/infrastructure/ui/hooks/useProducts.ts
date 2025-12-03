import { useState, useEffect } from 'react';
import { Product } from '@features/products/domain/entities/Product.entity';
import { useDependency } from '@core/di';
import { ServiceContainer } from '@app/di/ServiceContainer';
import { GetAllProducts } from '@features/products/application/use-cases/GetAllProducts';

interface UseProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export const useProducts = () => {
  const { productRepository } = useDependency<ServiceContainer>();
  const [state, setState] = useState<UseProductsState>({
    products: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setState({ products: [], isLoading: true, error: null });
        
        const useCase = new GetAllProducts(productRepository);
        const products = await useCase.execute();
        
        setState({ products, isLoading: false, error: null });
      } catch (error) {
        setState({
          products: [],
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load products',
        });
      }
    };

    fetchProducts();
  }, [productRepository]);

  return state;
};
