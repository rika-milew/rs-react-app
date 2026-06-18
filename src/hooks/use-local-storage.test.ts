import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './use-local-storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('search', 'blastoise'));

    expect(result.current[0]).toBe('blastoise');
  });

  it('returns saved and trimmed value from localStorage', () => {
    localStorage.setItem('search', '  bulbasaur  ');

    const { result } = renderHook(() => useLocalStorage('search', 'blastoise'));

    expect(result.current[0]).toBe('bulbasaur');
  });

  it('returns empty string when localStorage has empty string', () => {
    localStorage.setItem('search', '');

    const { result } = renderHook(() => useLocalStorage('search', 'blastoise'));

    expect(result.current[0]).toBe('');
  });

  it('returns empty string when initial value is not provided', () => {
    const { result } = renderHook(() => useLocalStorage('search'));

    expect(result.current[0]).toBe('');
  });

  it('updates and saves trimmed value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('search', 'blastoise'));

    act(() => {
      result.current[1]('  bulbasaur  ');
    });

    expect(result.current[0]).toBe('bulbasaur');
    expect(localStorage.getItem('search')).toBe('bulbasaur');
  });

  it('returns initial value when localStorage.getItem throws error', () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('Quota exceeded');
      });

    const { result } = renderHook(() => useLocalStorage('search', 'default'));

    expect(result.current[0]).toBe('default');
    expect(consoleSpy).toHaveBeenCalledWith(
      'localStorage read failed:',
      expect.any(Error),
    );
    expect(getItemSpy).toHaveBeenCalledWith('search');

    getItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('multiple hooks with different keys work independently', () => {
    const { result: result1 } = renderHook(() =>
      useLocalStorage('key1', 'default1'),
    );
    const { result: result2 } = renderHook(() =>
      useLocalStorage('key2', 'default2'),
    );

    act(() => {
      result1.current[1]('bulbasaur');
      result2.current[1]('blastoise');
    });

    expect(result1.current[0]).toBe('bulbasaur');
    expect(result2.current[0]).toBe('blastoise');
    expect(localStorage.getItem('key1')).toBe('bulbasaur');
    expect(localStorage.getItem('key2')).toBe('blastoise');
  });
});
