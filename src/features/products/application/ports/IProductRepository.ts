import { Product, ProductDetail } from '@features/products/domain/entities/Product.entity';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<ProductDetail>;
}
