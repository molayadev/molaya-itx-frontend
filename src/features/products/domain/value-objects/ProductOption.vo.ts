export interface ProductOptionBase {
  code: number;
  name: string;
}

export type ProductOption = Readonly<ProductOptionBase>;

export const createProductOption = (data: ProductOptionBase): ProductOption => {
  if (data.code < 0) {
    throw new Error('Option code must be non-negative');
  }
  
  if (!data.name || data.name.trim() === '') {
    throw new Error('Option name is required');
  }
  
  return Object.freeze({ ...data });
};
