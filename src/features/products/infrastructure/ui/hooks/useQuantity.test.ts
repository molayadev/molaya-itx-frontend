import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useQuantity } from './useQuantity';

describe('useQuantity', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useQuantity({ initialValue: 5 }));
    
    expect(result.current.quantity).toBe(5);
  });

  it('should increment quantity', () => {
    const { result } = renderHook(() => useQuantity({ initialValue: 1 }));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.quantity).toBe(2);
  });

  it('should decrement quantity', () => {
    const { result } = renderHook(() => useQuantity({ initialValue: 5 }));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.quantity).toBe(4);
  });

  it('should not go below min', () => {
    const { result } = renderHook(() => useQuantity({ initialValue: 1, min: 1 }));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.quantity).toBe(1);
  });

  it('should not go above max', () => {
    const { result } = renderHook(() => useQuantity({ initialValue: 99, max: 99 }));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.quantity).toBe(99);
  });

  it('should set value directly', () => {
    const { result } = renderHook(() => useQuantity());
    
    act(() => {
      result.current.setValue(10);
    });
    
    expect(result.current.quantity).toBe(10);
  });

  it('should clamp value to min when set below min', () => {
    const { result } = renderHook(() => useQuantity({ min: 1 }));
    
    act(() => {
      result.current.setValue(0);
    });
    
    expect(result.current.quantity).toBe(1);
  });

  it('should clamp value to max when set above max', () => {
    const { result } = renderHook(() => useQuantity({ max: 99 }));
    
    act(() => {
      result.current.setValue(100);
    });
    
    expect(result.current.quantity).toBe(99);
  });

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useQuantity({ initialValue: 5 }));
    
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.quantity).toBe(7);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.quantity).toBe(5);
  });

  it('should report isAtMin correctly', () => {
    const { result } = renderHook(() => useQuantity({ initialValue: 1, min: 1 }));
    
    expect(result.current.isAtMin).toBe(true);
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.isAtMin).toBe(false);
  });

  it('should report isAtMax correctly', () => {
    const { result } = renderHook(() => useQuantity({ initialValue: 99, max: 99 }));
    
    expect(result.current.isAtMax).toBe(true);
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.isAtMax).toBe(false);
  });
});
