import { ALPHABET } from './config.js';

const takeUnique = (
  pool: readonly string[],
  count: number,
  random: () => number,
): readonly string[] => {
  if (count === 0) return [];
  const index = Math.floor(random() * pool.length);
  const rest = pool.filter((_, i) => i !== index);
  return [pool[index], ...takeUnique(rest, count - 1, random)];
};

export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  if (length > base) {
    throw new RangeError(`Cannot pick ${length} unique digits in base ${base}`);
  }
  return takeUnique([...ALPHABET.slice(0, base)], length, random).join('');
};
