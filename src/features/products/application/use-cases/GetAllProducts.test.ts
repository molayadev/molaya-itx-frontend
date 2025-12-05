import { GetAllProducts } from './GetAllProducts';
import { IProductRepository } from '../ports/IProductRepository';
import { Product } from '@features/products/domain/entities/Product.entity';

const mockProduct: Product = Object.freeze({
  id: 'ZmGrkLRPXOTpxsU4jjAcv',
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: 170,
  imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
});

describe('GetAllProducts', () => {
  it('should return all products from repository', async () => {
    const mockRepository: IProductRepository = {
      getAll: jest.fn().mockResolvedValue([mockProduct]),
      getById: jest.fn(),
    };

    const useCase = new GetAllProducts(mockRepository);
    const result = await useCase.execute();

    expect(result).toEqual([mockProduct]);
    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no products', async () => {
    const mockRepository: IProductRepository = {
      getAll: jest.fn().mockResolvedValue([]),
      getById: jest.fn(),
    };

    const useCase = new GetAllProducts(mockRepository);
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it('should propagate repository errors', async () => {
    const mockRepository: IProductRepository = {
      getAll: jest.fn().mockRejectedValue(new Error('Network error')),
      getById: jest.fn(),
    };

    const useCase = new GetAllProducts(mockRepository);

    await expect(useCase.execute()).rejects.toThrow('Network error');
  });
});
