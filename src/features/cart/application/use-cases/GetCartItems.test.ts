import { GetCartItems } from './GetCartItems';
import { ICartRepository } from '../ports/ICartRepository';
import { createCart } from '@features/cart/domain/entities/Cart.entity';
import { createCartItem } from '@features/cart/domain/entities/CartItem.entity';

describe('GetCartItems', () => {
  const createMockCartItem = () => {
    return createCartItem({
      productId: 'iphone-14',
      name: 'iPhone 14',
      image: 'https://example.com/iphone14.jpg',
      colorCode: 1,
      colorName: 'Blue',
      storageCode: 256,
      storageName: '256GB',
      quantity: 2,
      price: 999.99,
    });
  };

  it('should return null when cart is empty', () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn(),
      getCart: jest.fn().mockReturnValue(null),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const useCase = new GetCartItems(mockRepository);
    const result = useCase.execute();

    expect(result).toBeNull();
    expect(mockRepository.getCart).toHaveBeenCalledTimes(1);
  });

  it('should return cart with items', () => {
    const cart = createCart();
    cart.addItem(createMockCartItem());

    const mockRepository: ICartRepository = {
      addItem: jest.fn(),
      getCart: jest.fn().mockReturnValue(cart),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const useCase = new GetCartItems(mockRepository);
    const result = useCase.execute();

    expect(result).toBe(cart);
    expect(result?.getTotalItems()).toBe(2);
    expect(mockRepository.getCart).toHaveBeenCalledTimes(1);
  });

  it('should call repository getCart method', () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn(),
      getCart: jest.fn().mockReturnValue(null),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const useCase = new GetCartItems(mockRepository);
    useCase.execute();

    expect(mockRepository.getCart).toHaveBeenCalled();
  });
});
