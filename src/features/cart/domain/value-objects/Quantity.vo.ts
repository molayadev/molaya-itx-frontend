export interface QuantityValue {
  value: number;
}

export type Quantity = Readonly<QuantityValue>;

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

export const createQuantity = (value: number): Quantity => {
  if (!Number.isInteger(value)) {
    throw new Error('Quantity must be an integer');
  }

  if (value < MIN_QUANTITY) {
    throw new Error(`Quantity must be at least ${MIN_QUANTITY}`);
  }

  if (value > MAX_QUANTITY) {
    throw new Error(`Quantity cannot exceed ${MAX_QUANTITY}`);
  }

  return Object.freeze({ value });
};

export const addQuantities = (q1: Quantity, q2: Quantity): Quantity => {
  const total = q1.value + q2.value;
  return createQuantity(total);
};

export const subtractQuantity = (q1: Quantity, amount: number): Quantity => {
  const result = q1.value - amount;
  return createQuantity(result);
};
