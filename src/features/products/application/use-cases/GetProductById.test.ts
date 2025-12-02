import { GetProductById } from './GetProductById';
import { IProductRepository } from '../ports/IProductRepository';
import { ProductDetail } from '@features/products/domain/entities/Product.entity';

const mockProductDetail: ProductDetail = Object.freeze({
  id: 'ZmGrkLRPXOTpxsU4jjAcv',
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: 170,
  imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
  options: {
    colors: [{ code: 1000, name: 'Black' }],
    storages: [{ code: 2000, name: '16 GB' }],
  },
}) as ProductDetail;

describe('GetProductById', () => {
  it('should throw error if id is empty', async () => {
    const mockRepository: IProductRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
    };

    const useCase = new GetProductById(mockRepository);

    await expect(useCase.execute('')).rejects.toThrow('Product ID is required');
  });

  it('should throw error if id is whitespace', async () => {
    const mockRepository: IProductRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
    };

    const useCase = new GetProductById(mockRepository);

    await expect(useCase.execute('   ')).rejects.toThrow('Product ID is required');
  });

  it('should call repository with correct id', async () => {
    const mockRepository: IProductRepository = {
      getAll: jest.fn(),
      getById: jest.fn().mockResolvedValue(mockProductDetail),
    };

    const useCase = new GetProductById(mockRepository);
    await useCase.execute('ZmGrkLRPXOTpxsU4jjAcv');

    expect(mockRepository.getById).toHaveBeenCalledWith('ZmGrkLRPXOTpxsU4jjAcv');
  });

  it('should return product detail from repository', async () => {
    const mockRepository: IProductRepository = {
      getAll: jest.fn(),
      getById: jest.fn().mockResolvedValue(mockProductDetail),
    };

    const useCase = new GetProductById(mockRepository);
    const result = await useCase.execute('ZmGrkLRPXOTpxsU4jjAcv');

    expect(result).toEqual(mockProductDetail);
    expect(result.id).toBe('ZmGrkLRPXOTpxsU4jjAcv');
    expect(result.options.colors).toHaveLength(1);
    expect(result.options.storages).toHaveLength(1);
  });

  it('should propagate repository errors', async () => {
    const mockRepository: IProductRepository = {
      getAll: jest.fn(),
      getById: jest.fn().mockRejectedValue(new Error('Product not found')),
    };

    const useCase = new GetProductById(mockRepository);

    await expect(useCase.execute('999')).rejects.toThrow('Product not found');
  });
});
