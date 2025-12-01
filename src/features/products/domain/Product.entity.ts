export interface ProductDTO {
  id: string;
  brand: string;
  model: string;
  price: string;
  imgUrl: string;
}

interface ProductBase {
  id: string;
  brand: string;
  model: string;
  price: number;
  imgUrl: string;
}

export type Product = Readonly<ProductBase>;
