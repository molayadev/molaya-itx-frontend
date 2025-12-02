import { CartItem } from '@features/cart/domain/entities/CartItem.entity';

export interface ICartRepository {
  addItem(item: CartItem): Promise<number>;
}
