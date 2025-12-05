import { renderHook, act } from '@testing-library/react';
import { useProductOptions } from './useProductOptions';

describe('useProductOptions', () => {
  const mockColors = [
    { code: 1, name: 'Black' },
    { code: 2, name: 'White' },
  ];

  const mockStorages = [
    { code: 1, name: '32 GB' },
  ];

  it('should auto-select first option when multiple colors available', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: mockStorages })
    );

    expect(result.current.selectedColorCode).toBe(1);
  });

  it('should auto-select first option when storage available', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: mockStorages })
    );

    expect(result.current.selectedStorageCode).toBe(1);
  });

  it('should allow manual selection change', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: mockStorages })
    );

    expect(result.current.selectedColorCode).toBe(1);

    act(() => {
      result.current.setSelectedColorCode(2);
    });

    expect(result.current.selectedColorCode).toBe(2);
  });

  it('should handle products with only colors (no storage)', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: [] })
    );

    expect(result.current.selectedColorCode).toBe(1);
    expect(result.current.selectedStorageCode).toBeNull();
  });

  it('should handle empty options gracefully', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: [], storages: [] })
    );

    expect(result.current.selectedColorCode).toBeNull();
    expect(result.current.selectedStorageCode).toBeNull();
  });

  it('should update selection when options change', () => {
    const { result, rerender } = renderHook(
      ({ colors, storages }) => useProductOptions({ colors, storages }),
      {
        initialProps: {
          colors: mockColors,
          storages: mockStorages,
        },
      }
    );

    expect(result.current.selectedColorCode).toBe(1);

    const newColors = [{ code: 3, name: 'Red' }];
    rerender({ colors: newColors, storages: mockStorages });

    expect(result.current.selectedColorCode).toBe(3);
  });
});
