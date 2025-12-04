import { Cart, createCart } from '../entities/Cart.entity';
import { CartItem, createCartItem } from '../entities/CartItem.entity';
import { CartStorageDTO, CartItemStorageDTO } from '../dtos/CartStorageDTO';

export class CartMapper {
  static toStorage(cart: Cart): CartStorageDTO {
    const items = cart.getItems();

    return {
      items: items.map((item) => this.cartItemToStorage(item)),
      lastUpdated: cart.getLastUpdated().toISOString(),
    };
  }

  static fromStorage(dto: CartStorageDTO): Cart {
    try {
      const items = dto.items.map((itemDto) => this.cartItemFromStorage(itemDto));
      const lastUpdated = new Date(dto.lastUpdated);

      return createCart(items, lastUpdated);
    } catch (error) {
      throw new Error(`Failed to parse cart from storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static cartItemToStorage(item: CartItem): CartItemStorageDTO {
    return {
      productId: item.productId,
      name: item.name,
      image: item.image,
      colorCode: item.colorCode,
      colorName: item.colorName,
      storageCode: item.storageCode,
      storageName: item.storageName,
      quantity: item.quantity,
      price: item.price,
    };
  }

  private static cartItemFromStorage(dto: CartItemStorageDTO): CartItem {
    return createCartItem({
      productId: dto.productId,
      name: dto.name,
      image: dto.image,
      colorCode: dto.colorCode,
      colorName: dto.colorName,
      storageCode: dto.storageCode,
      storageName: dto.storageName,
      quantity: dto.quantity,
      price: dto.price,
    });
  }
}
