export interface ProductDTO {
  id: string;
  brand: string;
  model: string;
  price: string;
  imgUrl: string;
}

export interface ProductDetailDTO {
  id: string;
  brand: string;
  model: string;
  price: string;
  imgUrl: string;
  options: {
    colors: Array<{ code: number; name: string }>;
    storages: Array<{ code: number; name: string }>;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
