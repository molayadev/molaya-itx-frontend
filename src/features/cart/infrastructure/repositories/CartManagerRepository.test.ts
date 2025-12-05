import { CartManagerRepository } from './CartManagerRepository';
import { ApiClient } from '@core/infrastructure/http/ApiClient';
import { ICache } from '@core/infrastructure/cache/ICache';
import { createCartItem } from '@features/cart/domain/entities/CartItem.entity';
import { createCart } from '@features/cart/domain/entities/Cart.entity';
import { CartMapper } from '@features/cart/domain/mappers/CartMapper';
import { ILogger } from '@core/infrastructure/logger';

describe('CartManagerRepository', () => {
  let mockApiClient: jest.Mocked<ApiClient>;
  let mockCache: jest.Mocked<ICache>;
  let mockLogger: jest.Mocked<ILogger>;
  let repository: CartManagerRepository;
  const ttlMs = 24 * 60 * 60 * 1000;

  const createMockCartItem = (productId: string = 'ABC123', colorCode: number = 1000, storageCode: number = 2000) => {
    return createCartItem({
      productId,
      name: 'Test Product',
      image: 'https://example.com/image.jpg',
      colorCode,
      colorName: 'Blue',
      storageCode,
      storageName: '256GB',
      quantity: 1,
      price: 999.99,
    });
  };

  beforeEach(() => {
    mockApiClient = {
      post: jest.fn(),
    } as unknown as jest.Mocked<ApiClient>;

    mockCache = {
      get: jest.fn().mockReturnValue(null),
      set: jest.fn(),
      clear: jest.fn(),
      clearAll: jest.fn(),
    } as jest.Mocked<ICache>;

    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as jest.Mocked<ILogger>;
    
    repository = new CartManagerRepository(mockApiClient, mockCache, mockLogger, ttlMs);
  });

  it('should add item to empty cart, save to storage, and sync with API', async () => {
    const cartItem = createMockCartItem('ABC123', 1000, 2000);

    const mockResponse = { count: 1 };
    mockApiClient.post.mockResolvedValue(mockResponse);

    const count = await repository.addItem(cartItem);

    expect(mockCache.set).toHaveBeenCalled();
    
    expect(mockApiClient.post).toHaveBeenCalledWith({
      path: '/cart',
      body: {
        id: 'ABC123',
        colorCode: 1000,
        storageCode: 2000,
      }
    });

    expect(count).toBe(1);
  });

  it('should sum quantities when adding same item', async () => {
    const existingCart = createCart();
    existingCart.addItem(createMockCartItem('ABC123', 1000, 2000));
    const existingDto = CartMapper.toStorage(existingCart);

    mockCache.get.mockReturnValue(existingDto);
    mockApiClient.post.mockResolvedValue({ count: 2 });

    const cartItem = createMockCartItem('ABC123', 1000, 2000);
    const count = await repository.addItem(cartItem);

    expect(mockCache.set).toHaveBeenCalled();
    const savedCart = CartMapper.fromStorage((mockCache.set as jest.Mock).mock.calls[0][1].value);
    expect(savedCart.getTotalItems()).toBe(2);

    expect(count).toBe(2);
  });

  it('should return local count if API fails', async () => {
    const cartItem = createMockCartItem('ABC123', 1000, 2000);
    
    mockApiClient.post.mockRejectedValue(new Error('Network error'));

    const count = await repository.addItem(cartItem);

    expect(mockCache.set).toHaveBeenCalled();
    
    expect(count).toBe(1);
  });

  it('should send only id, colorCode and storageCode in request body', async () => {
    const cartItem = createMockCartItem('XYZ789', 5, 10);

    const mockResponse = { count: 1 };
    mockApiClient.post.mockResolvedValue(mockResponse);

    await repository.addItem(cartItem);

    const callArgs = mockApiClient.post.mock.calls[0][0];
    const requestBody = callArgs.body as Record<string, unknown>;

    expect(Object.keys(requestBody)).toEqual(['id', 'colorCode', 'storageCode']);
    expect(requestBody.id).toBe('XYZ789');
    expect(requestBody.colorCode).toBe(5);
    expect(requestBody.storageCode).toBe(10);
  });

  it('should save to localStorage even if API fails', async () => {
    const cartItem = createMockCartItem('001', 1, 2);

    const apiError = new Error('Network error');
    mockApiClient.post.mockRejectedValue(apiError);

    const count = await repository.addItem(cartItem);

    expect(mockCache.set).toHaveBeenCalled();
    const savedCart = CartMapper.fromStorage((mockCache.set as jest.Mock).mock.calls[0][1].value);
    expect(savedCart.getTotalItems()).toBe(1);
    
    expect(count).toBe(1);
  });

  it('should use correct API endpoint', async () => {
    const cartItem = createMockCartItem('001', 1, 2);

    mockApiClient.post.mockResolvedValue({ count: 1 });

    await repository.addItem(cartItem);

    const callArgs = mockApiClient.post.mock.calls[0][0];
    expect(callArgs.path).toBe('/cart');
  });

  describe('getCart', () => {
    it('should return null when cart is not in cache', () => {
      mockCache.get.mockReturnValue(null);

      const cart = repository.getCart();

      expect(cart).toBeNull();
      expect(mockCache.get).toHaveBeenCalledWith('ecommerce_cart');
    });

    it('should return cart when data exists in cache', () => {
      const cart = createCart();
      cart.addItem(createMockCartItem('iphone-14', 1, 256));
      const dto = CartMapper.toStorage(cart);

      mockCache.get.mockReturnValue(dto);

      const result = repository.getCart();

      expect(result).not.toBeNull();
      expect(result?.getTotalItems()).toBe(1);
    });

    it('should clear corrupted data and return null', () => {
      mockCache.get.mockReturnValue({ invalid: 'data' });

      const cart = repository.getCart();

      expect(cart).toBeNull();
      expect(mockCache.clear).toHaveBeenCalledWith('ecommerce_cart');
    });
  });

  describe('saveCart', () => {
    it('should save cart to cache with TTL', () => {
      const cart = createCart();
      cart.addItem(createMockCartItem('iphone-14', 1, 256));

      repository.saveCart(cart);

      expect(mockCache.set).toHaveBeenCalledWith(
        'ecommerce_cart',
        expect.objectContaining({
          value: expect.any(Object),
          ttlMs: ttlMs,
        })
      );
    });

    it('should save empty cart', () => {
      const cart = createCart();

      repository.saveCart(cart);

      expect(mockCache.set).toHaveBeenCalled();
    });
  });

  describe('updateItemQuantity', () => {
    it('should update quantity of existing item', () => {
      const cart = createCart();
      cart.addItem(createMockCartItem('iphone-14', 1, 256));
      const dto = CartMapper.toStorage(cart);

      mockCache.get.mockReturnValue(dto);

      const identifier = { productId: 'iphone-14', colorCode: 1, storageCode: 256 };
      repository.updateItemQuantity(identifier, 5);

      expect(mockCache.set).toHaveBeenCalled();
      const savedCart = CartMapper.fromStorage(
        (mockCache.set as jest.Mock).mock.calls[0][1].value
      );
      expect(savedCart.getItems()[0].quantity).toBe(5);
    });

    it('should throw error if cart not found', () => {
      mockCache.get.mockReturnValue(null);

      const identifier = { productId: 'iphone-14', colorCode: 1, storageCode: 256 };
      expect(() => {
        repository.updateItemQuantity(identifier, 5);
      }).toThrow('Cart not found');
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const cart = createCart();
      cart.addItem(createMockCartItem('iphone-14', 1, 256));
      const dto = CartMapper.toStorage(cart);

      mockCache.get.mockReturnValue(dto);

      const identifier = { productId: 'iphone-14', colorCode: 1, storageCode: 256 };
      repository.removeItem(identifier);

      expect(mockCache.set).toHaveBeenCalled();
      const savedCart = CartMapper.fromStorage(
        (mockCache.set as jest.Mock).mock.calls[0][1].value
      );
      expect(savedCart.isEmpty()).toBe(true);
    });

    it('should throw error if cart not found', () => {
      mockCache.get.mockReturnValue(null);

      const identifier = { productId: 'iphone-14', colorCode: 1, storageCode: 256 };
      expect(() => {
        repository.removeItem(identifier);
      }).toThrow('Cart not found');
    });
  });

  describe('clearCart', () => {
    it('should clear cart from cache', () => {
      repository.clearCart();

      expect(mockCache.clear).toHaveBeenCalledWith('ecommerce_cart');
    });
  });
});
