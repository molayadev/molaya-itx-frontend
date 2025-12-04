import { ICartRepository } from '../ports/ICartRepository';
import { CartItemIdentifier } from '@features/cart/domain/entities/CartItem.entity';

export class UpdateCartItemQuantity {
  constructor(private repository: ICartRepository) {}

  execute(identifier: CartItemIdentifier, quantity: number): void {
    this.repository.updateItemQuantity(identifier, quantity);
  }
}
