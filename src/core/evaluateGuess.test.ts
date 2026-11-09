import { describe, expect, it } from 'vitest';
import { evaluateGuess } from './evaluateGuess.js';

describe('evaluateGuess', () => {
  it.each([
    ['1234', '1234', 4, 0],
    ['1234', '4321', 0, 4],
    ['1234', '1243', 2, 2],
    ['1234', '5678', 0, 0],
    ['1234', '1567', 1, 0],
    ['1234', '5123', 0, 3],
    ['0123', '3210', 0, 4],
  ])('secret %s, guess %s → %i bulls, %i cows', (secret, guess, bulls, cows) => {
    expect(evaluateGuess(secret, guess)).toEqual({ bulls, cows });
  });

  it('регистр hex не важен', () => {
    expect(evaluateGuess('a1b2', 'A1B2')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('abcd', 'DCBA')).toEqual({ bulls: 0, cows: 4 });
  });

  it('bin: длина 2', () => {
    expect(evaluateGuess('01', '10')).toEqual({ bulls: 0, cows: 2 });
  });

  it('возвращает новый объект при каждом вызове', () => {
    expect(evaluateGuess('12', '12')).not.toBe(evaluateGuess('12', '12'));
  });
});
