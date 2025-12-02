import { IProductRepository } from '@features/products/application/ports/IProductRepository';
import { Product, ProductDetail } from '@features/products/domain/entities/Product.entity';
import { ProductDTO, ProductDetailDTO } from '@features/products/domain/dtos/ProductDTO';
import { ProductMapper } from '@features/products/domain/mappers/ProductMapper';
import { ApiClient } from '@core/infrastructure/http/ApiClient';

export class HttpProductRepository implements IProductRepository {
  constructor(private apiClient: ApiClient) {}

  async getAll(): Promise<Product[]> {
    const dtos = await this.apiClient.get<ProductDTO[]>('/product');
    return dtos.map(ProductMapper.toDomain);
  }

  async getById(id: string): Promise<ProductDetail> {
    const dto = await this.apiClient.get<ProductDetailDTO>(`/product/${id}`);
    return ProductMapper.toDetailDomain(dto);
  }
}
