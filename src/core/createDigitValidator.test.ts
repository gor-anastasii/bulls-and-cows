import { describe, expect, it } from 'vitest';
import { createDigitValidator } from './createDigitValidator.js';

describe('createDigitValidator', () => {
  it('возвращает функцию-предикат (каррирование)', () => {
    expect(typeof createDigitValidator(10)).toBe('function');
  });

  it('dec: принимает 0-9, отвергает буквы', () => {
    const isDigit = createDigitValidator(10);
    expect('0123456789'.split('').every(isDigit)).toBe(true);
    expect(isDigit('a')).toBe(false);
  });

  it('bin: принимает только 0 и 1', () => {
    const isDigit = createDigitValidator(2);
    expect(isDigit('0') && isDigit('1')).toBe(true);
    expect(isDigit('2')).toBe(false);
  });

  it('oct: принимает 7, отвергает 8', () => {
    const isDigit = createDigitValidator(8);
    expect(isDigit('7')).toBe(true);
    expect(isDigit('8')).toBe(false);
  });

  it('hex: регистр не важен', () => {
    const isDigit = createDigitValidator(16);
    ['a', 'f', 'A', 'F'].forEach((c) => expect(isDigit(c)).toBe(true));
    ['g', 'G'].forEach((c) => expect(isDigit(c)).toBe(false));
  });

  it('отвергает пустую строку, несколько символов и спецсимволы', () => {
    const isDigit = createDigitValidator(16);
    ['', '12', ' ', '-'].forEach((c) => expect(isDigit(c)).toBe(false));
  });

  it('валидаторы разных систем независимы', () => {
    const bin = createDigitValidator(2);
    const hex = createDigitValidator(16);
    expect(bin('9')).toBe(false);
    expect(hex('9')).toBe(true);
  });
});
