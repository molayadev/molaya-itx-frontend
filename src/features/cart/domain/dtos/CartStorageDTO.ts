export interface CartItemStorageDTO {
  productId: string;
  name: string;
  image: string;
  colorCode: number;
  colorName: string;
  storageCode: number;
  storageName: string;
  quantity: number;
  price: number;
}

export interface CartStorageDTO {
  items: CartItemStorageDTO[];
  lastUpdated: string; // ISO date string
}
