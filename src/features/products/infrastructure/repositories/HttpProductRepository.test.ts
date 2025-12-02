import { HttpProductRepository } from './HttpProductRepository';
import { ApiClient } from '@core/infrastructure/http/ApiClient';
import { ProductDTO, ProductDetailDTO } from '@features/products/domain/dtos/ProductDTO';

const mockProductDTO: ProductDTO = {
  id: 'ZmGrkLRPXOTpxsU4jjAcv',
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: '170',
  imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
};

const mockProductDetailDTO: ProductDetailDTO = {
  ...mockProductDTO,
  options: {
    colors: [{ code: 1, name: 'Black' }],
    storages: [{ code: 1, name: '128GB' }],
  },
};

describe('HttpProductRepository', () => {
  let mockApiClient: jest.Mocked<ApiClient>;
  let repository: HttpProductRepository;

  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ApiClient>;

    repository = new HttpProductRepository(mockApiClient);
  });

  describe('getAll', () => {
    it('should fetch and map products', async () => {
      mockApiClient.get.mockResolvedValue([mockProductDTO]);

      const result = await repository.getAll();

      expect(mockApiClient.get).toHaveBeenCalledWith('/product');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('ZmGrkLRPXOTpxsU4jjAcv');
      expect(result[0].brand).toBe('Acer');
      expect(result[0].price).toBe(170);
    });

    it('should return empty array when API returns empty', async () => {
      mockApiClient.get.mockResolvedValue([]);

      const result = await repository.getAll();

      expect(result).toEqual([]);
    });

    it('should propagate API errors', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(repository.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('getById', () => {
    it('should fetch and map product detail', async () => {
      mockApiClient.get.mockResolvedValue(mockProductDetailDTO);

      const result = await repository.getById('ZmGrkLRPXOTpxsU4jjAcv');

      expect(mockApiClient.get).toHaveBeenCalledWith('/product/ZmGrkLRPXOTpxsU4jjAcv');
      expect(result.id).toBe('ZmGrkLRPXOTpxsU4jjAcv');
      expect(result.options.colors).toHaveLength(1);
      expect(result.options.colors[0].name).toBe('Black');
      expect(result.options.storages).toHaveLength(1);
      expect(result.options.storages[0].name).toBe('128GB');
    });

    it('should propagate API errors', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Product not found'));

      await expect(repository.getById('999')).rejects.toThrow('Product not found');
    });
  });
});
