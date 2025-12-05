export interface ProductBase {
  id: string;
  brand: string;
  model: string;
  price: number;
  imgUrl: string;
}

export interface ProductOptions {
  colorCode: number;
  colorName: string;
  storageCode: number;
  storageName: string;
}

export interface ProductDetail extends ProductBase {
  options: {
    colors: Array<{ code: number; name: string }>;
    storages: Array<{ code: number; name: string }>;
  };
  [key: string]: unknown;
}

export type Product = Readonly<ProductBase>;
export type ProductDetailReadonly = Readonly<ProductDetail>;

export const createProduct = (data: ProductBase): Product => {
  if (!data.id || data.id.trim() === '') {
    throw new Error('Product ID is required');
  }
  
  if (!data.brand || data.brand.trim() === '') {
    throw new Error('Product brand is required');
  }
  
  if (!data.model || data.model.trim() === '') {
    throw new Error('Product model is required');
  }
  
  if (data.price <= 0) {
    throw new Error('Product price must be greater than 0');
  }
  
  if (!data.imgUrl || data.imgUrl.trim() === '') {
    throw new Error('Product image URL is required');
  }
  
  return Object.freeze({ ...data });
};

export class ProductBuilder {
  private data: Partial<ProductBase> = {};

  id(id: string): this {
    this.data.id = id;
    return this;
  }

  brand(brand: string): this {
    this.data.brand = brand;
    return this;
  }

  model(model: string): this {
    this.data.model = model;
    return this;
  }

  price(price: number): this {
    this.data.price = price;
    return this;
  }

  imgUrl(imgUrl: string): this {
    this.data.imgUrl = imgUrl;
    return this;
  }

  build(): Product {
    return createProduct(this.data as ProductBase);
  }
}
