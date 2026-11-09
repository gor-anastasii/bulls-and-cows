import { describe, expect, it, vi } from 'vitest';
import { memoize } from './memoize.js';

describe('memoize', () => {
  it('вызывает исходную функцию один раз для одинаковых аргументов', () => {
    const spy = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(spy);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('считает заново для других аргументов', () => {
    const spy = vi.fn((a: number) => a * 2);
    const memoized = memoize(spy);
    memoized(1);
    memoized(2);
    expect(spy).toHaveBeenCalledTimes(2);
  });
  it('кэширует и «ложные» значения вроде 0', () => {
    const spy = vi.fn(() => 0);
    const memoized = memoize(spy);
    memoized();
    memoized();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
