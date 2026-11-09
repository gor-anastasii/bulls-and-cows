import type { Base, Settings } from './types.js';

export const ALPHABET = '0123456789abcdef';
export const BASES: readonly { value: Base; label: string }[] = [
  { value: 2, label: 'BIN' },
  { value: 8, label: 'OCT' },
  { value: 10, label: 'DEC' },
  { value: 16, label: 'HEX' },
];
export const LENGTHS = [2, 3, 4, 5, 6] as const;
export const DEFAULT_SETTINGS: Settings = { length: 4, base: 10 };
export const LEADERBOARD_SIZE = 10;
export const STORAGE_KEY = 'bulls-and-cows:scores';

export const baseLabel = (base: Base): string =>
  BASES.find((item) => item.value === base)?.label ?? '';
