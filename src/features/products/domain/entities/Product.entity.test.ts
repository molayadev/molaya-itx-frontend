import { createProduct, ProductBase, ProductBuilder } from './Product.entity';

describe('Product Entity', () => {
  const validProductData: ProductBase = {
    id: 'ZmGrkLRPXOTpxsU4jjAcv',
    brand: 'Acer',
    model: 'Iconia Talk S',
    price: 170,
    imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
  };

  describe('createProduct factory', () => {
    it('should create a valid product', () => {
      const product = createProduct(validProductData);

      expect(product.id).toBe('ZmGrkLRPXOTpxsU4jjAcv');
      expect(product.brand).toBe('Acer');
      expect(product.model).toBe('Iconia Talk S');
      expect(product.price).toBe(170);
      expect(product.imgUrl).toBe('https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg');
    });

    it('should freeze the product object', () => {
      const product = createProduct(validProductData);

      expect(Object.isFrozen(product)).toBe(true);
    });

    it('should throw error if id is empty', () => {
      const invalidData = { ...validProductData, id: '' };

      expect(() => createProduct(invalidData)).toThrow('Product ID is required');
    });

    it('should throw error if brand is empty', () => {
      const invalidData = { ...validProductData, brand: '' };

      expect(() => createProduct(invalidData)).toThrow('Product brand is required');
    });

    it('should throw error if model is empty', () => {
      const invalidData = { ...validProductData, model: '' };

      expect(() => createProduct(invalidData)).toThrow('Product model is required');
    });

    it('should throw error if price is zero', () => {
      const invalidData = { ...validProductData, price: 0 };

      expect(() => createProduct(invalidData)).toThrow('Product price must be greater than 0');
    });

    it('should throw error if price is negative', () => {
      const invalidData = { ...validProductData, price: -10 };

      expect(() => createProduct(invalidData)).toThrow('Product price must be greater than 0');
    });

    it('should throw error if imgUrl is empty', () => {
      const invalidData = { ...validProductData, imgUrl: '' };

      expect(() => createProduct(invalidData)).toThrow('Product image URL is required');
    });
  });

  describe('ProductBuilder', () => {
    it('should build a valid product with required fields', () => {
      const product = new ProductBuilder()
        .id('ZmGrkLRPXOTpxsU4jjAcv')
        .brand('Acer')
        .model('Iconia Talk S')
        .price(170)
        .imgUrl('https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg')
        .build();

      expect(product.id).toBe('ZmGrkLRPXOTpxsU4jjAcv');
      expect(product.brand).toBe('Acer');
      expect(product.model).toBe('Iconia Talk S');
      expect(product.price).toBe(170);
      expect(product.imgUrl).toBe('https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg');
    });

    it('should return frozen object from builder', () => {
      const product = new ProductBuilder()
        .id('cGjFJlmqNPIwU59AOcY8H')
        .brand('Acer')
        .model('Liquid Z6 Plus')
        .price(250)
        .imgUrl('https://itx-frontend-test.onrender.com/images/cGjFJlmqNPIwU59AOcY8H.jpg')
        .build();

      expect(Object.isFrozen(product)).toBe(true);
    });

    it('should throw error when building without required fields', () => {
      const builder = new ProductBuilder()
        .id('8hKbH2UHPM_944nRHYN1n')
        .brand('Acer');

      expect(() => builder.build()).toThrow();
    });

    it('should allow method chaining', () => {
      const builder = new ProductBuilder();
      const result = builder.id('ZmGrkLRPXOTpxsU4jjAcv');

      expect(result).toBe(builder);
    });
  });
});
