import { Product } from '@features/products/domain/entities/Product.entity';
import { IProductRepository } from '../ports/IProductRepository';

export class GetAllProducts {
  constructor(private repository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.repository.getAll();
  }
}
