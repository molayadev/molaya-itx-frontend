import { UpdateCartItemQuantity } from './UpdateCartItemQuantity';
import { ICartRepository } from '../ports/ICartRepository';
import { CartItemIdentifier } from '@features/cart/domain/entities/CartItem.entity';

describe('UpdateCartItemQuantity', () => {
  it('should update item quantity in cart', () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn(),
      getCart: jest.fn(),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const identifier: CartItemIdentifier = {
      productId: 'iphone-14',
      colorCode: 1,
      storageCode: 256,
    };

    const useCase = new UpdateCartItemQuantity(mockRepository);
    useCase.execute(identifier, 5);

    expect(mockRepository.updateItemQuantity).toHaveBeenCalledWith(identifier, 5);
    expect(mockRepository.updateItemQuantity).toHaveBeenCalledTimes(1);
  });

  it('should handle different quantity values', () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn(),
      getCart: jest.fn(),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const useCase = new UpdateCartItemQuantity(mockRepository);

    const identifier1: CartItemIdentifier = { productId: 'product-1', colorCode: 1, storageCode: 128 };
    useCase.execute(identifier1, 1);
    expect(mockRepository.updateItemQuantity).toHaveBeenCalledWith(identifier1, 1);

    const identifier2: CartItemIdentifier = { productId: 'product-2', colorCode: 2, storageCode: 256 };
    useCase.execute(identifier2, 99);
    expect(mockRepository.updateItemQuantity).toHaveBeenCalledWith(identifier2, 99);

    expect(mockRepository.updateItemQuantity).toHaveBeenCalledTimes(2);
  });

  it('should propagate errors from repository', () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn(),
      getCart: jest.fn(),
      updateItemQuantity: jest.fn().mockImplementation(() => {
        throw new Error('Item not found');
      }),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const identifier: CartItemIdentifier = { productId: 'iphone-14', colorCode: 1, storageCode: 256 };
    const useCase = new UpdateCartItemQuantity(mockRepository);

    expect(() => useCase.execute(identifier, 5)).toThrow('Item not found');
  });
});
