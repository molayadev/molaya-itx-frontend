import { ICartRepository } from '../ports/ICartRepository';
import { CartItemIdentifier } from '@features/cart/domain/entities/CartItem.entity';

export class RemoveFromCart {
  constructor(private repository: ICartRepository) {}

  execute(identifier: CartItemIdentifier): void {
    this.repository.removeItem(identifier);
  }
}
