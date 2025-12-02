import { ProductMapper } from './ProductMapper';
import { ProductDTO, ProductDetailDTO } from '../dtos/ProductDTO';

describe('ProductMapper', () => {
  const mockDTO: ProductDTO = {
    id: 'ZmGrkLRPXOTpxsU4jjAcv',
    brand: 'Acer',
    model: 'Iconia Talk S',
    price: '170',
    imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
  };

  it('should map DTO to Product entity', () => {
    const product = ProductMapper.toDomain(mockDTO);

    expect(product.id).toBe('ZmGrkLRPXOTpxsU4jjAcv');
    expect(product.brand).toBe('Acer');
    expect(product.model).toBe('Iconia Talk S');
    expect(product.price).toBe(170);
    expect(product.imgUrl).toBe('https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg');
  });

  it('should convert price from string to number', () => {
    const product = ProductMapper.toDomain(mockDTO);

    expect(typeof product.price).toBe('number');
    expect(product.price).toBe(170);
  });

  it('should map DetailDTO with all fields', () => {
    const detailDTO: ProductDetailDTO = {
      id: 'ZmGrkLRPXOTpxsU4jjAcv',
      brand: 'Acer',
      model: 'Iconia Talk S',
      price: '170',
      imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
      cpu: 'Quad-core 1.3 GHz',
      ram: '2 GB RAM',
      primaryCamera: ['13 MP', 'autofocus'],
      sensors: ['Accelerometer', 'proximity'],
      options: {
        colors: [
          { code: 1000, name: 'Black' },
          { code: 1001, name: 'White' },
        ],
        storages: [
          { code: 2000, name: '16 GB' },
          { code: 2001, name: '32 GB' },
        ],
      },
    };

    const detail = ProductMapper.toDetailDomain(detailDTO);

    expect(detail.id).toBe('ZmGrkLRPXOTpxsU4jjAcv');
    expect(detail.brand).toBe('Acer');
    expect(detail.price).toBe(170);
    expect(detail.cpu).toBe('Quad-core 1.3 GHz');
    expect(detail.ram).toBe('2 GB RAM');
    expect(detail.primaryCamera).toEqual(['13 MP', 'autofocus']);
    expect(detail.sensors).toEqual(['Accelerometer', 'proximity']);
    expect(detail.options.colors).toHaveLength(2);
    expect(detail.options.storages).toHaveLength(2);
  });

  it('should separate scalar and array fields', () => {
    const detailDTO: ProductDetailDTO = {
      id: 'ZmGrkLRPXOTpxsU4jjAcv',
      brand: 'Acer',
      model: 'Iconia Talk S',
      price: '170',
      imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
      cpu: 'Quad-core 1.3 GHz',
      ram: '2 GB RAM',
      primaryCamera: ['13 MP', 'autofocus'],
      sensors: ['Accelerometer', 'proximity'],
      options: {
        colors: [{ code: 1000, name: 'Black' }],
        storages: [{ code: 2000, name: '16 GB' }],
      },
    };

    const detail = ProductMapper.toDetailDomain(detailDTO);
    const scalars = ProductMapper.getScalarFields(detail);
    const arrays = ProductMapper.getArrayFields(detail);

    expect(scalars.cpu).toBe('Quad-core 1.3 GHz');
    expect(scalars.ram).toBe('2 GB RAM');
    expect(arrays.primaryCamera).toEqual(['13 MP', 'autofocus']);
    expect(arrays.sensors).toEqual(['Accelerometer', 'proximity']);
  });

  it('should handle decimal prices', () => {
    const dtoWithDecimal: ProductDTO = {
      id: 'cGjFJlmqNPIwU59AOcY8H',
      brand: 'Acer',
      model: 'Liquid Z6 Plus',
      price: '250.99',
      imgUrl: 'https://itx-frontend-test.onrender.com/images/cGjFJlmqNPIwU59AOcY8H.jpg',
    };

    const product = ProductMapper.toDomain(dtoWithDecimal);

    expect(product.price).toBe(250.99);
  });
});
