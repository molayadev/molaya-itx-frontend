import { Cart } from '@features/cart/domain/entities/Cart.entity';
import { ICartRepository } from '../ports/ICartRepository';

export class GetCartItems {
  constructor(private repository: ICartRepository) {}

  execute(): Cart | null {
    return this.repository.getCart();
  }
}
