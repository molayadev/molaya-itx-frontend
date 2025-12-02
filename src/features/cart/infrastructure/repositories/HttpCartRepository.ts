import { ICartRepository } from '@features/cart/application/ports/ICartRepository';
import { CartItem } from '@features/cart/domain/entities/CartItem.entity';
import { AddToCartRequestDTO, AddToCartResponseDTO } from '@features/cart/domain/dtos/CartDTO';
import { ApiClient } from '@core/infrastructure/http/ApiClient';

export class HttpCartRepository implements ICartRepository {
  constructor(private apiClient: ApiClient) {}

  async addItem(item: CartItem): Promise<number> {
    const requestDTO: AddToCartRequestDTO = {
      id: item.productId,
      colorCode: item.colorCode,
      storageCode: item.storageCode,
    };

    const response = await this.apiClient.post<AddToCartResponseDTO>({
      path: '/cart',
      body: requestDTO,
    });

    return response?.count ?? 0;
  }
}
