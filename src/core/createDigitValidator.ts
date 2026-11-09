import { ALPHABET } from './config.js';

export const createDigitValidator = (base: number) => {
  const allowed = new Set(ALPHABET.slice(0, base));
  return (char: string): boolean => char.length === 1 && allowed.has(char.toLowerCase());
};
