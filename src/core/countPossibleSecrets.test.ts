import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from './countPossibleSecrets.js';

describe('countPossibleSecrets', () => {
  it.each([
    [0, 10, 1],
    [1, 10, 10],
    [2, 2, 2],
    [2, 10, 90],
    [4, 8, 1680],
    [4, 10, 5040],
    [6, 10, 151200],
    [6, 16, 5765760],
  ])('P(%i, %i) = %i', (length, base, expected) => {
    expect(countPossibleSecrets(length, base)).toBe(expected);
  });

  it('возвращает 0, если длина больше основания', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
  });

  it('повторный вызов возвращает тот же результат', () => {
    expect(countPossibleSecrets(5, 16)).toBe(countPossibleSecrets(5, 16));
  });
});
