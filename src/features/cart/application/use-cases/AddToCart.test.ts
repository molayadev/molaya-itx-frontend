import { AddToCart } from './AddToCart';
import { ICartRepository } from '../ports/ICartRepository';
import { createCartItem } from '@features/cart/domain/entities/CartItem.entity';

const mockRepository: ICartRepository = {
  addItem: jest.fn().mockResolvedValue(3),
};

describe('AddToCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add item to cart and return count', async () => {
    const useCase = new AddToCart(mockRepository);
    const item = createCartItem({
      productId: '001',
      colorCode: 1,
      storageCode: 2,
    });

    const count = await useCase.execute(item);

    expect(count).toBe(3);
    expect(mockRepository.addItem).toHaveBeenCalledWith(item);
    expect(mockRepository.addItem).toHaveBeenCalledTimes(1);
  });

  it('should propagate repository errors', async () => {
    const errorMock = jest.fn().mockRejectedValue(new Error('Network error'));
    const repoWithError: ICartRepository = {
      addItem: errorMock,
    };

    const useCase = new AddToCart(repoWithError);
    const item = createCartItem({
      productId: '001',
      colorCode: 1,
      storageCode: 2,
    });

    await expect(useCase.execute(item)).rejects.toThrow('Network error');
    expect(errorMock).toHaveBeenCalledWith(item);
  });

  it('should handle multiple items', async () => {
    const counts = [1, 2, 3];
    let callCount = 0;
    const dynamicMock = jest.fn().mockImplementation(() => 
      Promise.resolve(counts[callCount++])
    );
    const repo: ICartRepository = {
      addItem: dynamicMock,
    };

    const useCase = new AddToCart(repo);

    const item1 = createCartItem({ productId: '001', colorCode: 1, storageCode: 1 });
    const item2 = createCartItem({ productId: '002', colorCode: 2, storageCode: 2 });
    const item3 = createCartItem({ productId: '003', colorCode: 3, storageCode: 3 });

    expect(await useCase.execute(item1)).toBe(1);
    expect(await useCase.execute(item2)).toBe(2);
    expect(await useCase.execute(item3)).toBe(3);

    expect(dynamicMock).toHaveBeenCalledTimes(3);
  });
});
