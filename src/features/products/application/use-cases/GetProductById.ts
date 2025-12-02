import { IProductRepository } from '../ports/IProductRepository';
import { ProductDetail } from '@features/products/domain/entities/Product.entity';

export class GetProductById {
  constructor(private repository: IProductRepository) {}

  async execute(id: string): Promise<ProductDetail> {
    if (!id || id.trim() === '') {
      throw new Error('Product ID is required');
    }

    return this.repository.getById(id);
  }
}
