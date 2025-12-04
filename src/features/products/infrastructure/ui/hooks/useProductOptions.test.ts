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

  it('should initialize with no selection when multiple options', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: mockStorages })
    );

    expect(result.current.selectedColorCode).toBeNull();
  });

  it('should auto-select when only one option available', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: mockStorages })
    );

    expect(result.current.selectedStorageCode).toBe(1);
  });

  it('should mark selection as incomplete when not all selected', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: mockStorages })
    );

    expect(result.current.isSelectionComplete).toBe(false);
  });

  it('should mark selection as complete when both selected', () => {
    const singleColor = [{ code: 1, name: 'Black' }];
    const singleStorage = [{ code: 1, name: '32 GB' }];

    const { result } = renderHook(() =>
      useProductOptions({ colors: singleColor, storages: singleStorage })
    );

    expect(result.current.isSelectionComplete).toBe(true);
  });

  it('should allow manual selection', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: mockStorages })
    );

    expect(result.current.selectedColorCode).toBeNull();

    act(() => {
      result.current.setSelectedColorCode(1);
    });

    expect(result.current.selectedColorCode).toBe(1);
  });
});
