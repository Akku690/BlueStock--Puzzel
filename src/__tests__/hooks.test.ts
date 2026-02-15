import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus, useLocalStorage, useDebounce, useTimer } from '../hooks';

describe('Custom Hooks', () => {
  describe('useOnlineStatus', () => {
    it('returns initial online status', () => {
      const { result } = renderHook(() => useOnlineStatus());
      expect(typeof result.current).toBe('boolean');
    });

    it('updates when going offline', () => {
      const { result } = renderHook(() => useOnlineStatus());
      
      act(() => {
        window.dispatchEvent(new Event('offline'));
      });
      
      expect(result.current).toBe(false);
    });

    it('updates when going online', () => {
      const { result } = renderHook(() => useOnlineStatus());
      
      act(() => {
        window.dispatchEvent(new Event('online'));
      });
      
      expect(result.current).toBe(true);
    });
  });

  describe('useLocalStorage', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('returns initial value when no stored value', () => {
      const { result } = renderHook(() => 
        useLocalStorage('test-key', 'initial')
      );
      
      expect(result.current[0]).toBe('initial');
    });

    it('stores and retrieves values', () => {
      const { result } = renderHook(() => 
        useLocalStorage('test-key', 'initial')
      );
      
      act(() => {
        result.current[1]('updated');
      });
      
      expect(result.current[0]).toBe('updated');
      expect(localStorage.getItem('test-key')).toBe('"updated"');
    });

    it('handles complex objects', () => {
      const { result } = renderHook(() => 
        useLocalStorage('test-key', { count: 0 })
      );
      
      act(() => {
        result.current[1]({ count: 5 });
      });
      
      expect(result.current[0]).toEqual({ count: 5 });
    });
  });

  describe('useDebounce', () => {
    jest.useFakeTimers();

    it('debounces value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );
      
      expect(result.current).toBe('initial');
      
      rerender({ value: 'updated', delay: 500 });
      expect(result.current).toBe('initial');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current).toBe('updated');
    });

    jest.useRealTimers();
  });

  describe('useTimer', () => {
    jest.useFakeTimers();

    it('starts and increments timer', () => {
      const { result } = renderHook(() => useTimer());
      
      act(() => {
        result.current.start();
        jest.advanceTimersByTime(1000);
      });
      
      expect(result.current.time).toBeGreaterThan(0);
    });

    it('pauses timer', () => {
      const { result } = renderHook(() => useTimer());
      
      act(() => {
        result.current.start();
        jest.advanceTimersByTime(500);
        result.current.pause();
      });
      
      const pausedTime = result.current.time;
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.time).toBe(pausedTime);
    });

    it('resets timer', () => {
      const { result } = renderHook(() => useTimer());
      
      act(() => {
        result.current.start();
        jest.advanceTimersByTime(1000);
        result.current.reset();
      });
      
      expect(result.current.time).toBe(0);
    });

    jest.useRealTimers();
  });
});
