import { HttpCartRepository } from './HttpCartRepository';
import { ApiClient } from '@core/infrastructure/http/ApiClient';
import { createCartItem } from '@features/cart/domain/entities/CartItem.entity';

describe('HttpCartRepository', () => {
  let mockApiClient: jest.Mocked<ApiClient>;
  let repository: HttpCartRepository;

  beforeEach(() => {
    mockApiClient = {
      post: jest.fn(),
    } as unknown as jest.Mocked<ApiClient>;

    repository = new HttpCartRepository(mockApiClient);
  });

  it('should add item to cart and return count', async () => {
    const cartItem = createCartItem({
      productId: 'ABC123',
      colorCode: 1000,
      storageCode: 2000,
    });

    const mockResponse = { count: 5 };
    mockApiClient.post.mockResolvedValue(mockResponse);

    const count = await repository.addItem(cartItem);

    expect(count).toBe(5);
    expect(mockApiClient.post).toHaveBeenCalledTimes(1);
    expect(mockApiClient.post).toHaveBeenCalledWith({
      path: '/cart',
      body: {
        id: 'ABC123',
        colorCode: 1000,
        storageCode: 2000,
      }
    });
  });

  it('should send only id, colorCode and storageCode in request body', async () => {
    const cartItem = createCartItem({
      productId: 'XYZ789',
      colorCode: 5,
      storageCode: 10,
    });

    const mockResponse = { count: 1 };
    mockApiClient.post.mockResolvedValue(mockResponse);

    await repository.addItem(cartItem);

    const callArgs = mockApiClient.post.mock.calls[0][0];
    const requestBody = callArgs.body as Record<string, unknown>;

    // Verificar que solo tenga estos 3 campos
    expect(Object.keys(requestBody)).toEqual(['id', 'colorCode', 'storageCode']);
    expect(requestBody.id).toBe('XYZ789');
    expect(requestBody.colorCode).toBe(5);
    expect(requestBody.storageCode).toBe(10);
  });

  it('should propagate API errors', async () => {
    const cartItem = createCartItem({
      productId: '001',
      colorCode: 1,
      storageCode: 2,
    });

    const apiError = new Error('Network error');
    mockApiClient.post.mockRejectedValue(apiError);

    await expect(repository.addItem(cartItem)).rejects.toThrow('Network error');
    expect(mockApiClient.post).toHaveBeenCalledTimes(1);
  });

  it('should handle different count values', async () => {
    const cartItem = createCartItem({
      productId: '001',
      colorCode: 1,
      storageCode: 2,
    });

    // Primera llamada retorna count: 1
    mockApiClient.post.mockResolvedValueOnce({ count: 1 });
    expect(await repository.addItem(cartItem)).toBe(1);

    // Segunda llamada retorna count: 10
    mockApiClient.post.mockResolvedValueOnce({ count: 10 });
    expect(await repository.addItem(cartItem)).toBe(10);

    // Tercera llamada retorna count: 99
    mockApiClient.post.mockResolvedValueOnce({ count: 99 });
    expect(await repository.addItem(cartItem)).toBe(99);
  });

  it('should use correct API endpoint', async () => {
    const cartItem = createCartItem({
      productId: '001',
      colorCode: 1,
      storageCode: 2,
    });

    mockApiClient.post.mockResolvedValue({ count: 1 });

    await repository.addItem(cartItem);

    const callArgs = mockApiClient.post.mock.calls[0][0];
    expect(callArgs.path).toBe('/cart');
  });
});
