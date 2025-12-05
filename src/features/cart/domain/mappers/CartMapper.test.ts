import { CartMapper } from './CartMapper';
import { createCart } from '../entities/Cart.entity';
import { createCartItem } from '../entities/CartItem.entity';
import { CartStorageDTO } from '../dtos/CartStorageDTO';

describe('CartMapper', () => {
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

  describe('toStorage', () => {
    it('should convert empty cart to storage DTO', () => {
      const cart = createCart();
      const dto = CartMapper.toStorage(cart);

      expect(dto.items).toEqual([]);
      expect(dto.lastUpdated).toBeTruthy();
      expect(typeof dto.lastUpdated).toBe('string');
    });

    it('should convert cart with items to storage DTO', () => {
      const cart = createCart();
      const item = createMockCartItem();
      cart.addItem(item);

      const dto = CartMapper.toStorage(cart);

      expect(dto.items).toHaveLength(1);
      expect(dto.items[0].productId).toBe('iphone-14');
      expect(dto.items[0].name).toBe('iPhone 14');
      expect(dto.items[0].image).toBe('https://example.com/iphone14.jpg');
      expect(dto.items[0].colorCode).toBe(1);
      expect(dto.items[0].colorName).toBe('Blue');
      expect(dto.items[0].storageCode).toBe(256);
      expect(dto.items[0].storageName).toBe('256GB');
      expect(dto.items[0].quantity).toBe(2);
      expect(dto.items[0].price).toBe(999.99);
    });

    it('should store lastUpdated as ISO string', () => {
      const testDate = new Date('2025-12-04T10:00:00.000Z');
      const cart = createCart([], testDate);

      const dto = CartMapper.toStorage(cart);

      expect(dto.lastUpdated).toBe('2025-12-04T10:00:00.000Z');
    });

    it('should convert multiple items correctly', () => {
      const cart = createCart();
      const item1 = createMockCartItem();
      const item2 = createCartItem({
        productId: 'iphone-15',
        name: 'iPhone 15',
        image: 'https://example.com/iphone15.jpg',
        colorCode: 2,
        colorName: 'Red',
        storageCode: 512,
        storageName: '512GB',
        quantity: 1,
        price: 1099.99,
      });

      cart.addItem(item1);
      cart.addItem(item2);

      const dto = CartMapper.toStorage(cart);

      expect(dto.items).toHaveLength(2);
      expect(dto.items[0].productId).toBe('iphone-14');
      expect(dto.items[1].productId).toBe('iphone-15');
    });
  });

  describe('fromStorage', () => {
    it('should convert empty storage DTO to cart', () => {
      const dto: CartStorageDTO = {
        items: [],
        lastUpdated: '2025-12-04T10:00:00.000Z',
      };

      const cart = CartMapper.fromStorage(dto);

      expect(cart.isEmpty()).toBe(true);
      expect(cart.getTotalItems()).toBe(0);
    });

    it('should convert storage DTO with items to cart', () => {
      const dto: CartStorageDTO = {
        items: [
          {
            productId: 'iphone-14',
            name: 'iPhone 14',
            image: 'https://example.com/iphone14.jpg',
            colorCode: 1,
            colorName: 'Blue',
            storageCode: 256,
            storageName: '256GB',
            quantity: 2,
            price: 999.99,
          },
        ],
        lastUpdated: '2025-12-04T10:00:00.000Z',
      };

      const cart = CartMapper.fromStorage(dto);

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getTotalItems()).toBe(2);
      expect(cart.getItems()[0].productId).toBe('iphone-14');
      expect(cart.getItems()[0].name).toBe('iPhone 14');
    });

    it('should parse lastUpdated date correctly', () => {
      const dto: CartStorageDTO = {
        items: [],
        lastUpdated: '2025-12-04T10:00:00.000Z',
      };

      const cart = CartMapper.fromStorage(dto);

      expect(cart.getLastUpdated().toISOString()).toBe('2025-12-04T10:00:00.000Z');
    });

    it('should throw error for invalid cart item data', () => {
      const dto: CartStorageDTO = {
        items: [
          {
            productId: '', // Invalid
            name: 'iPhone 14',
            image: 'https://example.com/iphone14.jpg',
            colorCode: 1,
            colorName: 'Blue',
            storageCode: 256,
            storageName: '256GB',
            quantity: 2,
            price: 999.99,
          },
        ],
        lastUpdated: '2025-12-04T10:00:00.000Z',
      };

      expect(() => CartMapper.fromStorage(dto)).toThrow('Failed to parse cart from storage');
    });

    it('should throw error for invalid date', () => {
      const dto: CartStorageDTO = {
        items: [],
        lastUpdated: 'invalid-date',
      };

      const cart = CartMapper.fromStorage(dto);
      expect(cart.getLastUpdated().toString()).toBe('Invalid Date');
    });

    it('should round-trip conversion correctly', () => {
      const originalCart = createCart();
      const item = createMockCartItem();
      originalCart.addItem(item);

      const dto = CartMapper.toStorage(originalCart);
      const restoredCart = CartMapper.fromStorage(dto);

      expect(restoredCart.getTotalItems()).toBe(originalCart.getTotalItems());
      expect(restoredCart.getTotalPrice()).toBe(originalCart.getTotalPrice());
      expect(restoredCart.getItems()[0].productId).toBe(
        originalCart.getItems()[0].productId
      );
    });
  });
});
