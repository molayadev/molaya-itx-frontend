import { ICache } from '@core/infrastructure/cache/ICache';
import { ICartRepository } from '@features/cart/application/ports/ICartRepository';
import { Cart, createCart } from '@features/cart/domain/entities/Cart.entity';
import { CartItem, CartItemIdentifier } from '@features/cart/domain/entities/CartItem.entity';
import { CartMapper } from '@features/cart/domain/mappers/CartMapper';
import { ILogger } from '@core/infrastructure/logger/ILogger';
import { ApiClient } from '@core/infrastructure/http';
import { AddToCartRequestDTO, AddToCartResponseDTO, CartStorageDTO } from '@features/cart/domain/dtos';

export class CartManagerRepository implements ICartRepository {
  private readonly CART_KEY = 'ecommerce_cart';
  private readonly ttlMs: number;

  constructor(private apiClient: ApiClient, private cache: ICache, private logger: ILogger, cartTtlMs: number) {
    this.ttlMs = cartTtlMs;
  }

  async addItem(item: CartItem): Promise<number> {
    this.logger.info({message: '[CartManagerRepository] addItem called', context: { item }});
    
    const cart = this.getCart() || createCart();
    this.logger.info({message: '[CartManagerRepository] Current cart state', context: { cartItems: cart.getItems().length }});
    
    cart.addItem(item);
    this.logger.info({message: '[CartManagerRepository] Item added to cart', context: { totalItems: cart.getTotalItems() }});
    
    this.saveCart(cart);
    this.logger.info({message: '[CartManagerRepository] Cart saved to cache'});

    try {
      const requestDTO: AddToCartRequestDTO = {
        id: item.productId,
        colorCode: item.colorCode,
        storageCode: item.storageCode,
      };
      this.logger.info({message: '[CartManagerRepository] Syncing with API', context: { requestDTO }});

      const response = await this.apiClient.post<AddToCartResponseDTO>({
        path: '/cart',
        body: requestDTO,
      });

      this.logger.info({message: '[CartManagerRepository] API sync successful', context: { count: response?.count }});
      return response?.count ?? 0;
    } catch (error: unknown) {
      this.logger.error({message: '[CartManagerRepository] Failed to sync cart with API', error});
      return cart.getTotalItems();
    }
  }

  getCart(): Cart | null {
    this.logger.info({message: '[CartManagerRepository] getCart called'});
    const data = this.cache.get<CartStorageDTO>(this.CART_KEY);
    
    if (!data) {
      this.logger.info({message: '[CartManagerRepository] No cart found in cache'});
      return null;
    }

    try {
      const cart = CartMapper.fromStorage(data);
      this.logger.info({message: '[CartManagerRepository] Cart loaded from cache', context: { items: cart.getItems().length }});
      return cart;
    } catch (error: unknown) {
      this.logger.error({message: '[CartManagerRepository] Failed to parse cart from storage', error});
      this.cache.clear(this.CART_KEY);
      return null;
    }
  }

  saveCart(cart: Cart): void {
    this.logger.info({message: '[CartManagerRepository] saveCart called', context: { items: cart.getItems().length }});
    const dto = CartMapper.toStorage(cart);
    this.cache.set(this.CART_KEY, { value: dto, ttlMs: this.ttlMs });
    this.logger.info({message: '[CartManagerRepository] Cart saved successfully'});
  }

  updateItemQuantity(identifier: CartItemIdentifier, quantity: number): void {
    const cart = this.getCart();
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.updateItemQuantity(
      identifier.productId,
      identifier.colorCode,
      identifier.storageCode,
      quantity
    );
    this.saveCart(cart);
  }

  removeItem(identifier: CartItemIdentifier): void {
    const cart = this.getCart();
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.removeItem(
      identifier.productId,
      identifier.colorCode,
      identifier.storageCode
    );
    this.saveCart(cart);
  }

  clearCart(): void {
    this.cache.clear(this.CART_KEY);
  }
}
