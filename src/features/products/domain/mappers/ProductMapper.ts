import { Product, ProductDetail, createProduct } from '../entities/Product.entity';
import { createProductOption } from '../value-objects/ProductOption.vo';
import { ProductDTO, ProductDetailDTO } from '../dtos/ProductDTO';

export class ProductMapper {
  static toDomain(dto: ProductDTO): Product {
    return createProduct({
      id: dto.id,
      brand: dto.brand,
      model: dto.model,
      price: parseFloat(dto.price),
      imgUrl: dto.imgUrl,
    });
  }

  static toDetailDomain(dto: ProductDetailDTO): ProductDetail {
    const { options, id, brand, model, price, imgUrl, ...otherFields } = dto;

    const detail: ProductDetail = {
      id,
      brand,
      model,
      price: parseFloat(price),
      imgUrl,
      options: {
        colors: options.colors.map(createProductOption),
        storages: options.storages.map(createProductOption),
      },
      ...otherFields,
    };

    return Object.freeze(detail) as ProductDetail;
  }

  static getInformativeFields(detail: ProductDetail): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, brand, model, price, imgUrl, options, ...informative } = detail;
    return informative;
  }

  static getArrayFields(detail: ProductDetail): Record<string, unknown[]> {
    const informative = this.getInformativeFields(detail);
    const arrays: Record<string, unknown[]> = {};
    
    for (const [key, value] of Object.entries(informative)) {
      if (Array.isArray(value)) {
        arrays[key] = value;
      }
    }
    
    return arrays;
  }

  static getScalarFields(detail: ProductDetail): Record<string, string | number | boolean> {
    const informative = this.getInformativeFields(detail);
    const scalars: Record<string, string | number | boolean> = {};
    
    for (const [key, value] of Object.entries(informative)) {
      if (!Array.isArray(value) && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
        scalars[key] = value;
      }
    }
    
    return scalars;
  }
}
