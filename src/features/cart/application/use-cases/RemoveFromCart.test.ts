import { RemoveFromCart } from './RemoveFromCart';
import { ICartRepository } from '../ports/ICartRepository';
import { CartItemIdentifier } from '@features/cart/domain/entities/CartItem.entity';

describe('RemoveFromCart', () => {
  it('should remove item from cart', () => {
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

    const useCase = new RemoveFromCart(mockRepository);
    useCase.execute(identifier);

    expect(mockRepository.removeItem).toHaveBeenCalledWith(identifier);
    expect(mockRepository.removeItem).toHaveBeenCalledTimes(1);
  });

  it('should handle different product variations', () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn(),
      getCart: jest.fn(),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const useCase = new RemoveFromCart(mockRepository);

    const identifier1: CartItemIdentifier = { productId: 'product-1', colorCode: 1, storageCode: 128 };
    useCase.execute(identifier1);
    expect(mockRepository.removeItem).toHaveBeenCalledWith(identifier1);

    const identifier2: CartItemIdentifier = { productId: 'product-2', colorCode: 2, storageCode: 256 };
    useCase.execute(identifier2);
    expect(mockRepository.removeItem).toHaveBeenCalledWith(identifier2);

    expect(mockRepository.removeItem).toHaveBeenCalledTimes(2);
  });

  it('should propagate errors from repository', () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn(),
      getCart: jest.fn(),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn().mockImplementation(() => {
        throw new Error('Item not found in cart');
      }),
      clearCart: jest.fn(),
    };

    const identifier: CartItemIdentifier = { productId: 'iphone-14', colorCode: 1, storageCode: 256 };
    const useCase = new RemoveFromCart(mockRepository);

    expect(() => useCase.execute(identifier)).toThrow('Item not found in cart');
  });
});
