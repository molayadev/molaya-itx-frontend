import { createCartItem } from './CartItem.entity';

describe('CartItem', () => {
  it('should create valid cart item', () => {
    const item = createCartItem({
      productId: '001',
      colorCode: 1,
      storageCode: 2,
    });

    expect(item.productId).toBe('001');
    expect(item.colorCode).toBe(1);
    expect(item.storageCode).toBe(2);
  });

  it('should throw error if productId is empty', () => {
    expect(() =>
      createCartItem({ productId: '', colorCode: 1, storageCode: 2 })
    ).toThrow('Product ID is required');
  });

  it('should throw error if productId is whitespace', () => {
    expect(() =>
      createCartItem({ productId: '   ', colorCode: 1, storageCode: 2 })
    ).toThrow('Product ID is required');
  });

  it('should throw error if colorCode is negative', () => {
    expect(() =>
      createCartItem({ productId: '001', colorCode: -1, storageCode: 2 })
    ).toThrow('Color code must be non-negative');
  });

  it('should throw error if storageCode is negative', () => {
    expect(() =>
      createCartItem({ productId: '001', colorCode: 1, storageCode: -1 })
    ).toThrow('Storage code must be non-negative');
  });

  it('should accept zero as valid colorCode', () => {
    const item = createCartItem({
      productId: '001',
      colorCode: 0,
      storageCode: 2,
    });

    expect(item.colorCode).toBe(0);
  });

  it('should accept zero as valid storageCode', () => {
    const item = createCartItem({
      productId: '001',
      colorCode: 1,
      storageCode: 0,
    });

    expect(item.storageCode).toBe(0);
  });

  it('should be immutable', () => {
    const item = createCartItem({
      productId: '001',
      colorCode: 1,
      storageCode: 2,
    });

    expect(Object.isFrozen(item)).toBe(true);
  });

  it('should not allow modification of properties', () => {
    const item = createCartItem({
      productId: '001',
      colorCode: 1,
      storageCode: 2,
    });

    expect(() => {
      // @ts-expect-error - Testing immutability
      item.productId = '002';
    }).toThrow();
  });
});
