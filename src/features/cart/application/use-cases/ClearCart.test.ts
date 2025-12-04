import { ClearCart } from './ClearCart';
import { ICartRepository } from '../ports/ICartRepository';

describe('ClearCart', () => {
  it('should clear all items from cart', () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn(),
      getCart: jest.fn(),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const useCase = new ClearCart(mockRepository);
    useCase.execute();

    expect(mockRepository.clearCart).toHaveBeenCalledTimes(1);
  });

  it('should call repository clearCart method', () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn(),
      getCart: jest.fn(),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const useCase = new ClearCart(mockRepository);
    useCase.execute();

    expect(mockRepository.clearCart).toHaveBeenCalled();
  });

  it('should propagate errors from repository', () => {
    const mockRepository: ICartRepository = {
      addItem: jest.fn(),
      getCart: jest.fn(),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn().mockImplementation(() => {
        throw new Error('Storage error');
      }),
    };

    const useCase = new ClearCart(mockRepository);

    expect(() => useCase.execute()).toThrow('Storage error');
  });
});
