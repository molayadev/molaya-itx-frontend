import { CartItem, CartItemIdentifier } from '@features/cart/domain/entities/CartItem.entity';
import { Cart } from '@features/cart/domain/entities/Cart.entity';

export interface ICartRepository {
  addItem(item: CartItem): Promise<number>;

  getCart(): Cart | null;

  updateItemQuantity(identifier: CartItemIdentifier, quantity: number): void;

  removeItem(identifier: CartItemIdentifier): void;

  clearCart(): void;
}
