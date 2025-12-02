import { CartItem } from '@features/cart/domain/entities/CartItem.entity';
import { ICartRepository } from '../ports/ICartRepository';

export class AddToCart {
  constructor(private repository: ICartRepository) {}

  async execute(item: CartItem): Promise<number> {
    return this.repository.addItem(item);
  }
}
