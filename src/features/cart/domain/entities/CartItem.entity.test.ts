import { createCartItem, CartItemBase } from './CartItem.entity';

describe('CartItem', () => {
  const validCartItemData: CartItemBase = {
    productId: '001',
    name: 'iPhone 14',
    image: 'https://example.com/iphone14.jpg',
    colorCode: 1,
    colorName: 'Blue',
    storageCode: 256,
    storageName: '256GB',
    quantity: 2,
    price: 999.99,
  };

  it('should create valid cart item', () => {
    const item = createCartItem(validCartItemData);

    expect(item.productId).toBe('001');
    expect(item.name).toBe('iPhone 14');
    expect(item.image).toBe('https://example.com/iphone14.jpg');
    expect(item.colorCode).toBe(1);
    expect(item.colorName).toBe('Blue');
    expect(item.storageCode).toBe(256);
    expect(item.storageName).toBe('256GB');
    expect(item.quantity).toBe(2);
    expect(item.price).toBe(999.99);
  });

  it('should throw error if productId is empty', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, productId: '' })
    ).toThrow('Product ID is required');
  });

  it('should throw error if productId is whitespace', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, productId: '   ' })
    ).toThrow('Product ID is required');
  });

  it('should throw error if name is empty', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, name: '' })
    ).toThrow('Product name is required');
  });

  it('should throw error if image is empty', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, image: '' })
    ).toThrow('Product image is required');
  });

  it('should throw error if colorCode is negative', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, colorCode: -1 })
    ).toThrow('Color code must be non-negative');
  });

  it('should throw error if colorName is empty', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, colorName: '' })
    ).toThrow('Color name is required');
  });

  it('should throw error if storageCode is negative', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, storageCode: -1 })
    ).toThrow('Storage code must be non-negative');
  });

  it('should throw error if storageName is empty', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, storageName: '' })
    ).toThrow('Storage name is required');
  });

  it('should throw error if quantity is not an integer', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, quantity: 2.5 })
    ).toThrow('Quantity must be an integer between 1 and 99');
  });

  it('should throw error if quantity is below 1', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, quantity: 0 })
    ).toThrow('Quantity must be an integer between 1 and 99');
  });

  it('should throw error if quantity is above 99', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, quantity: 100 })
    ).toThrow('Quantity must be an integer between 1 and 99');
  });

  it('should throw error if price is negative', () => {
    expect(() =>
      createCartItem({ ...validCartItemData, price: -10 })
    ).toThrow('Price must be non-negative');
  });

  it('should accept zero as valid colorCode', () => {
    const item = createCartItem({ ...validCartItemData, colorCode: 0 });
    expect(item.colorCode).toBe(0);
  });

  it('should accept zero as valid storageCode', () => {
    const item = createCartItem({ ...validCartItemData, storageCode: 0 });
    expect(item.storageCode).toBe(0);
  });

  it('should accept zero as valid price', () => {
    const item = createCartItem({ ...validCartItemData, price: 0 });
    expect(item.price).toBe(0);
  });

  it('should accept quantity of 1', () => {
    const item = createCartItem({ ...validCartItemData, quantity: 1 });
    expect(item.quantity).toBe(1);
  });

  it('should accept quantity of 99', () => {
    const item = createCartItem({ ...validCartItemData, quantity: 99 });
    expect(item.quantity).toBe(99);
  });

  it('should be immutable', () => {
    const item = createCartItem(validCartItemData);
    expect(Object.isFrozen(item)).toBe(true);
  });

  it('should not allow modification of properties', () => {
    const item = createCartItem(validCartItemData);

    expect(() => {
      // @ts-expect-error - Testing immutability
      item.productId = '002';
    }).toThrow();
  });
});
