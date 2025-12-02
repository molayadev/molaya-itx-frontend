export interface CartItemBase {
  productId: string;
  colorCode: number;
  storageCode: number;
}

export type CartItem = Readonly<CartItemBase>;

export const createCartItem = (data: CartItemBase): CartItem => {
  if (!data.productId || data.productId.trim() === '') {
    throw new Error('Product ID is required');
  }

  if (data.colorCode < 0) {
    throw new Error('Color code must be non-negative');
  }

  if (data.storageCode < 0) {
    throw new Error('Storage code must be non-negative');
  }

  return Object.freeze({ ...data });
};
