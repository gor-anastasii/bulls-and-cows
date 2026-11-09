import { describe, expect, it } from 'vitest';
import { isValidGuess } from './isValidGuess.js';

describe('isValidGuess', () => {
  it('принимает корректную попытку', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
  });
  it('принимает лидирующий ноль', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });
  it('отвергает неверную длину', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
    expect(isValidGuess('12345', 4, 10)).toBe(false);
    expect(isValidGuess('', 4, 10)).toBe(false);
  });
  it('отвергает недопустимые символы', () => {
    expect(isValidGuess('12a4', 4, 10)).toBe(false);
    expect(isValidGuess('12 4', 4, 10)).toBe(false);
    expect(isValidGuess('0112', 4, 2)).toBe(false);
  });
  it('отвергает повторяющиеся цифры', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
  });
  it('hex: верхний и нижний регистр принимаются', () => {
    expect(isValidGuess('A1f3', 4, 16)).toBe(true);
  });
  it('hex: a и A считаются одной цифрой (повтор)', () => {
    expect(isValidGuess('aA12', 4, 16)).toBe(false);
  });
  it('bin: длина 2 с разными цифрами', () => {
    expect(isValidGuess('01', 2, 2)).toBe(true);
    expect(isValidGuess('11', 2, 2)).toBe(false);
  });
});
