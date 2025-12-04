import { CartItem } from './CartItem.entity';

export interface CartBase {
  items: CartItem[];
  lastUpdated: Date;
}

export class Cart {
  private items: CartItem[];
  private lastUpdated: Date;

  constructor(items: CartItem[] = [], lastUpdated?: Date) {
    this.items = [...items];
    this.lastUpdated = lastUpdated || new Date();
  }

  addItem(newItem: CartItem): void {
    const existingIndex = this.findItemIndex(
      newItem.productId,
      newItem.colorCode,
      newItem.storageCode
    );

    if (existingIndex !== -1) {
      // Item exists, sum quantities
      const existingItem = this.items[existingIndex];
      const newQuantity = existingItem.quantity + newItem.quantity;

      if (newQuantity > 99) {
        throw new Error('Cannot add item: total quantity would exceed maximum (99)');
      }

      this.items[existingIndex] = {
        ...existingItem,
        quantity: newQuantity,
      };
    } else {
      // New item, add to cart
      this.items.push(newItem);
    }

    this.lastUpdated = new Date();
  }

  updateItemQuantity(
    productId: string,
    colorCode: number,
    storageCode: number,
    quantity: number
  ): void {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error('Quantity must be an integer between 1 and 99');
    }

    const index = this.findItemIndex(productId, colorCode, storageCode);

    if (index === -1) {
      throw new Error('Item not found in cart');
    }

    this.items[index] = {
      ...this.items[index],
      quantity,
    };

    this.lastUpdated = new Date();
  }

  removeItem(productId: string, colorCode: number, storageCode: number): void {
    const index = this.findItemIndex(productId, colorCode, storageCode);

    if (index === -1) {
      throw new Error('Item not found in cart');
    }

    this.items.splice(index, 1);
    this.lastUpdated = new Date();
  }

  clear(): void {
    this.items = [];
    this.lastUpdated = new Date();
  }

  getItems(): readonly CartItem[] {
    return Object.freeze([...this.items]);
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getLastUpdated(): Date {
    return new Date(this.lastUpdated);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  hasItem(productId: string, colorCode: number, storageCode: number): boolean {
    return this.findItemIndex(productId, colorCode, storageCode) !== -1;
  }

  private findItemIndex(
    productId: string,
    colorCode: number,
    storageCode: number
  ): number {
    return this.items.findIndex(
      (item) =>
        item.productId === productId &&
        item.colorCode === colorCode &&
        item.storageCode === storageCode
    );
  }
}

export const createCart = (items: CartItem[] = [], lastUpdated?: Date): Cart => {
  return new Cart(items, lastUpdated);
};
