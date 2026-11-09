import { describe, expect, it } from 'vitest';
import { generateSecret } from './generateSecret.js';

const sequence = (values: readonly number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

const lcg = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

describe('generateSecret', () => {
  it('random=0 даёт первые цифры алфавита и сохраняет ведущий ноль', () => {
    expect(generateSecret(4, 10, () => 0)).toBe('0123');
  });
  it('random≈1 берёт последние доступные цифры', () => {
    expect(generateSecret(4, 10, () => 0.999)).toBe('9876');
  });
  it('детерминированная последовательность даёт предсказуемый результат', () => {
    expect(generateSecret(4, 10, sequence([0.5, 0, 0.99, 0]))).toBe('5091');
  });
  it('работает для hex', () => {
    expect(generateSecret(3, 16, sequence([0.999, 0, 0]))).toBe('f01');
  });
  it('работает для bin', () => {
    expect(generateSecret(2, 2, () => 0)).toBe('01');
  });
  it('цифры всегда уникальны и из алфавита системы', () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const secret = generateSecret(6, 16, lcg(seed));
      expect(secret).toHaveLength(6);
      expect(new Set(secret).size).toBe(6);
      expect(secret).toMatch(/^[0-9a-f]+$/);
    }
  });
  it('бросает RangeError, если длина больше основания', () => {
    expect(() => generateSecret(3, 2, () => 0)).toThrow(RangeError);
  });
  it('по умолчанию использует Math.random', () => {
    expect(generateSecret(4, 10)).toHaveLength(4);
  });
});
