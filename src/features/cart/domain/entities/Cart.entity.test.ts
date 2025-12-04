import { createCart } from './Cart.entity';
import { createCartItem, CartItem } from './CartItem.entity';

describe('Cart Entity', () => {
  const createMockCartItem = (
    productId: string = 'iphone-14',
    quantity: number = 1,
    colorCode: number = 1,
    storageCode: number = 256
  ): CartItem => {
    return createCartItem({
      productId,
      name: `Product ${productId}`,
      image: `https://example.com/${productId}.jpg`,
      colorCode,
      colorName: `Color ${colorCode}`,
      storageCode,
      storageName: `${storageCode}GB`,
      quantity,
      price: 999.99,
    });
  };

  describe('createCart', () => {
    it('should create an empty cart', () => {
      const cart = createCart();

      expect(cart.getItems()).toEqual([]);
      expect(cart.isEmpty()).toBe(true);
      expect(cart.getTotalItems()).toBe(0);
      expect(cart.getTotalPrice()).toBe(0);
    });

    it('should create a cart with initial items', () => {
      const item = createMockCartItem('iphone-14', 2);
      const cart = createCart([item]);

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getTotalItems()).toBe(2);
      expect(cart.isEmpty()).toBe(false);
    });

    it('should set lastUpdated date', () => {
      const cart = createCart();
      expect(cart.getLastUpdated()).toBeInstanceOf(Date);
    });
  });

  describe('addItem', () => {
    it('should add a new item to empty cart', () => {
      const cart = createCart();
      const item = createMockCartItem('iphone-14', 1);

      cart.addItem(item);

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getTotalItems()).toBe(1);
    });

    it('should add multiple different items', () => {
      const cart = createCart();
      const item1 = createMockCartItem('iphone-14', 1, 1, 256);
      const item2 = createMockCartItem('iphone-14', 1, 2, 256);
      cart.addItem(item1);
      cart.addItem(item2);

      expect(cart.getItems()).toHaveLength(2);
      expect(cart.getTotalItems()).toBe(2);
    });

    it('should sum quantities when adding same item', () => {
      const cart = createCart();
      const item1 = createMockCartItem('iphone-14', 2);
      const item2 = createMockCartItem('iphone-14', 3);

      cart.addItem(item1);
      cart.addItem(item2);

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getTotalItems()).toBe(5);
      expect(cart.getItems()[0].quantity).toBe(5);
    });

    it('should throw error if total quantity exceeds maximum', () => {
      const cart = createCart();
      const item1 = createMockCartItem('iphone-14', 50);
      const item2 = createMockCartItem('iphone-14', 50);

      cart.addItem(item1);

      expect(() => cart.addItem(item2)).toThrow(
        'Cannot add item: total quantity would exceed maximum (99)'
      );
    });

    it('should update lastUpdated when adding item', () => {
      const cart = createCart();
      const initialDate = cart.getLastUpdated();
      setTimeout(() => {
        cart.addItem(createMockCartItem('iphone-14'));
        expect(cart.getLastUpdated().getTime()).toBeGreaterThan(initialDate.getTime());
      }, 10);
    });
  });

  describe('updateItemQuantity', () => {
    it('should update quantity of existing item', () => {
      const cart = createCart();
      const item = createMockCartItem('iphone-14', 2);

      cart.addItem(item);
      cart.updateItemQuantity('iphone-14', 1, 256, 5);

      expect(cart.getItems()[0].quantity).toBe(5);
      expect(cart.getTotalItems()).toBe(5);
    });

    it('should throw error for non-existent item', () => {
      const cart = createCart();

      expect(() => cart.updateItemQuantity('non-existent', 1, 256, 5)).toThrow(
        'Item not found in cart'
      );
    });

    it('should throw error for invalid quantity', () => {
      const cart = createCart();
      const item = createMockCartItem('iphone-14', 2);

      cart.addItem(item);

      expect(() => cart.updateItemQuantity('iphone-14', 1, 256, 0)).toThrow(
        'Quantity must be an integer between 1 and 99'
      );

      expect(() => cart.updateItemQuantity('iphone-14', 1, 256, 100)).toThrow(
        'Quantity must be an integer between 1 and 99'
      );

      expect(() => cart.updateItemQuantity('iphone-14', 1, 256, 2.5)).toThrow(
        'Quantity must be an integer between 1 and 99'
      );
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const cart = createCart();
      const item = createMockCartItem('iphone-14', 2);

      cart.addItem(item);
      cart.removeItem('iphone-14', 1, 256);

      expect(cart.isEmpty()).toBe(true);
      expect(cart.getTotalItems()).toBe(0);
    });

    it('should throw error when removing non-existent item', () => {
      const cart = createCart();

      expect(() => cart.removeItem('non-existent', 1, 256)).toThrow('Item not found in cart');
    });

    it('should only remove specific variant', () => {
      const cart = createCart();
      const item1 = createMockCartItem('iphone-14', 1, 1, 256);
      const item2 = createMockCartItem('iphone-14', 1, 2, 256);

      cart.addItem(item1);
      cart.addItem(item2);
      cart.removeItem('iphone-14', 1, 256);

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0].colorCode).toBe(2);
    });
  });

  describe('clear', () => {
    it('should remove all items from cart', () => {
      const cart = createCart();
      cart.addItem(createMockCartItem('iphone-14', 2));
      cart.addItem(createMockCartItem('iphone-15', 3));

      cart.clear();

      expect(cart.isEmpty()).toBe(true);
      expect(cart.getTotalItems()).toBe(0);
      expect(cart.getItems()).toHaveLength(0);
    });
  });

  describe('getTotalItems', () => {
    it('should return sum of all quantities', () => {
      const cart = createCart();
      cart.addItem(createMockCartItem('iphone-14', 2));
      cart.addItem(createMockCartItem('iphone-15', 3));

      expect(cart.getTotalItems()).toBe(5);
    });

    it('should return 0 for empty cart', () => {
      const cart = createCart();
      expect(cart.getTotalItems()).toBe(0);
    });
  });

  describe('getTotalPrice', () => {
    it('should calculate total price correctly', () => {
      const cart = createCart();
      const item1 = createMockCartItem('iphone-14', 2);
      const item2 = createMockCartItem('iphone-15', 1);

      cart.addItem(item1);
      cart.addItem(item2);

      expect(cart.getTotalPrice()).toBeCloseTo(2999.97, 2);
    });

    it('should return 0 for empty cart', () => {
      const cart = createCart();
      expect(cart.getTotalPrice()).toBe(0);
    });
  });

  describe('hasItem', () => {
    it('should return true if item exists', () => {
      const cart = createCart();
      cart.addItem(createMockCartItem('iphone-14', 1, 1, 256));

      expect(cart.hasItem('iphone-14', 1, 256)).toBe(true);
    });

    it('should return false if item does not exist', () => {
      const cart = createCart();

      expect(cart.hasItem('iphone-14', 1, 256)).toBe(false);
    });

    it('should distinguish between different variants', () => {
      const cart = createCart();
      cart.addItem(createMockCartItem('iphone-14', 1, 1, 256));

      expect(cart.hasItem('iphone-14', 1, 256)).toBe(true);
      expect(cart.hasItem('iphone-14', 2, 256)).toBe(false);
      expect(cart.hasItem('iphone-14', 1, 512)).toBe(false);
    });
  });

  describe('getItems', () => {
    it('should return a frozen copy of items', () => {
      const cart = createCart();
      cart.addItem(createMockCartItem('iphone-14', 1));

      const items = cart.getItems();

      expect(Object.isFrozen(items)).toBe(true);
    });

    it('should not allow modification of returned array', () => {
      const cart = createCart();
      cart.addItem(createMockCartItem('iphone-14', 1));

      const items = cart.getItems() as CartItem[];

      expect(() => {
        items.push(createMockCartItem('iphone-15', 1));
      }).toThrow();
    });
  });
});
