import { AddToCart } from './AddToCart';
import { ICartRepository } from '../ports/ICartRepository';
import { createCartItem } from '@features/cart/domain/entities/CartItem.entity';

const createMockCartItem = (productId: string = '001', colorCode: number = 1, storageCode: number = 2) => {
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

describe('AddToCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add item to cart and return count', async () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn().mockResolvedValue(3),
      getCart: jest.fn(),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const useCase = new AddToCart(mockRepository);
    const item = createMockCartItem('001', 1, 2);

    const count = await useCase.execute(item);

    expect(count).toBe(3);
    expect(mockRepository.addItem).toHaveBeenCalledWith(item);
    expect(mockRepository.addItem).toHaveBeenCalledTimes(1);
  });

  it('should propagate repository errors', async () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn().mockRejectedValue(new Error('Storage error')),
      getCart: jest.fn(),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const useCase = new AddToCart(mockRepository);
    const item = createMockCartItem('001', 1, 2);

    await expect(useCase.execute(item)).rejects.toThrow('Storage error');
    expect(mockRepository.addItem).toHaveBeenCalledWith(item);
  });

  it('should handle multiple items', async () => {
    const counts = [1, 2, 3];
    let callCount = 0;

    const mockRepository: ICartRepository = {
      addItem: jest.fn().mockImplementation(() => Promise.resolve(counts[callCount++])),
      getCart: jest.fn(),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const useCase = new AddToCart(mockRepository);

    const item1 = createMockCartItem('001', 1, 1);
    const item2 = createMockCartItem('002', 2, 2);
    const item3 = createMockCartItem('003', 3, 3);

    expect(await useCase.execute(item1)).toBe(1);
    expect(await useCase.execute(item2)).toBe(2);
    expect(await useCase.execute(item3)).toBe(3);
    expect(mockRepository.addItem).toHaveBeenCalledTimes(3);
  });
});
