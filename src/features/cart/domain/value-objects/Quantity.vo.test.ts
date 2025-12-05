import { 
  createQuantity, 
  addQuantities, 
  subtractQuantity,
  MIN_QUANTITY,
  MAX_QUANTITY
} from './Quantity.vo';

describe('Quantity Value Object', () => {
  describe('createQuantity', () => {
    it('should create a valid quantity', () => {
      const quantity = createQuantity(5);
      expect(quantity.value).toBe(5);
    });

    it('should create quantity with minimum value', () => {
      const quantity = createQuantity(MIN_QUANTITY);
      expect(quantity.value).toBe(MIN_QUANTITY);
    });

    it('should create quantity with maximum value', () => {
      const quantity = createQuantity(MAX_QUANTITY);
      expect(quantity.value).toBe(MAX_QUANTITY);
    });

    it('should throw error for non-integer values', () => {
      expect(() => createQuantity(5.5)).toThrow('Quantity must be an integer');
    });

    it('should throw error for quantity below minimum', () => {
      expect(() => createQuantity(0)).toThrow(`Quantity must be at least ${MIN_QUANTITY}`);
      expect(() => createQuantity(-1)).toThrow(`Quantity must be at least ${MIN_QUANTITY}`);
    });

    it('should throw error for quantity above maximum', () => {
      expect(() => createQuantity(100)).toThrow(`Quantity cannot exceed ${MAX_QUANTITY}`);
      expect(() => createQuantity(200)).toThrow(`Quantity cannot exceed ${MAX_QUANTITY}`);
    });

    it('should return a frozen object', () => {
      const quantity = createQuantity(5);
      expect(Object.isFrozen(quantity)).toBe(true);
    });
  });

  describe('addQuantities', () => {
    it('should add two quantities correctly', () => {
      const q1 = createQuantity(5);
      const q2 = createQuantity(3);
      const result = addQuantities(q1, q2);
      expect(result.value).toBe(8);
    });

    it('should throw error if sum exceeds maximum', () => {
      const q1 = createQuantity(50);
      const q2 = createQuantity(50);
      expect(() => addQuantities(q1, q2)).toThrow(`Quantity cannot exceed ${MAX_QUANTITY}`);
    });
  });

  describe('subtractQuantity', () => {
    it('should subtract quantity correctly', () => {
      const quantity = createQuantity(10);
      const result = subtractQuantity(quantity, 3);
      expect(result.value).toBe(7);
    });

    it('should throw error if result is below minimum', () => {
      const quantity = createQuantity(5);
      expect(() => subtractQuantity(quantity, 5)).toThrow(`Quantity must be at least ${MIN_QUANTITY}`);
    });

    it('should allow subtracting to minimum value', () => {
      const quantity = createQuantity(5);
      const result = subtractQuantity(quantity, 4);
      expect(result.value).toBe(1);
    });
  });
});
