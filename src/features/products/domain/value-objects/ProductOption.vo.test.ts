import { createProductOption, ProductOptionBase } from './ProductOption.vo';

describe('ProductOption Value Object', () => {
  const validOptionData: ProductOptionBase = {
    code: 1,
    name: 'Black',
  };

  it('should create a valid product option', () => {
    const option = createProductOption(validOptionData);

    expect(option.code).toBe(1);
    expect(option.name).toBe('Black');
  });

  it('should freeze the option object', () => {
    const option = createProductOption(validOptionData);

    expect(Object.isFrozen(option)).toBe(true);
  });

  it('should throw error if code is negative', () => {
    const invalidData = { ...validOptionData, code: -1 };

    expect(() => createProductOption(invalidData)).toThrow('Option code must be non-negative');
  });

  it('should throw error if name is empty', () => {
    const invalidData = { ...validOptionData, name: '' };

    expect(() => createProductOption(invalidData)).toThrow('Option name is required');
  });

  it('should allow code to be zero', () => {
    const zeroCodeData = { ...validOptionData, code: 0 };
    const option = createProductOption(zeroCodeData);

    expect(option.code).toBe(0);
  });
});
