import type { Settings } from './types.js';

export const isLengthAvailable = (length: number, base: number): boolean => length <= base;

export const normalizeSettings = (settings: Settings): Settings =>
  isLengthAvailable(settings.length, settings.base)
    ? settings
    : { ...settings, length: settings.base };
