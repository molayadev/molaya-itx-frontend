export interface CartItemBase {
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

export type CartItem = Readonly<CartItemBase>;

export const createCartItem = (data: CartItemBase): CartItem => {
  if (!data.productId || data.productId.trim() === '') {
    throw new Error('Product ID is required');
  }

  if (!data.name || data.name.trim() === '') {
    throw new Error('Product name is required');
  }

  if (!data.image || data.image.trim() === '') {
    throw new Error('Product image is required');
  }

  if (data.colorCode < 0) {
    throw new Error('Color code must be non-negative');
  }

  if (!data.colorName || data.colorName.trim() === '') {
    throw new Error('Color name is required');
  }

  if (data.storageCode < 0) {
    throw new Error('Storage code must be non-negative');
  }

  if (!data.storageName || data.storageName.trim() === '') {
    throw new Error('Storage name is required');
  }

  if (!Number.isInteger(data.quantity) || data.quantity < 1 || data.quantity > 99) {
    throw new Error('Quantity must be an integer between 1 and 99');
  }

  if (data.price < 0) {
    throw new Error('Price must be non-negative');
  }

  return Object.freeze({ ...data });
};

export const isSameCartItem = (
  item1: CartItem,
  item2: CartItem
): boolean => {
  return (
    item1.productId === item2.productId &&
    item1.colorCode === item2.colorCode &&
    item1.storageCode === item2.storageCode
  );
};

/**
 * Utility type to identify a cart item by its unique properties
 */
export type CartItemIdentifier = Pick<CartItem, 'productId' | 'colorCode' | 'storageCode'>;
