import { ICartRepository } from '../ports/ICartRepository';

export class ClearCart {
  constructor(private repository: ICartRepository) {}

  execute(): void {
    this.repository.clearCart();
  }
}
