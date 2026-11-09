import { describe, expect, it } from 'vitest';
import { isLengthAvailable, normalizeSettings } from './settings.js';

describe('isLengthAvailable', () => {
  it('bin: доступна только длина 2', () => {
    expect([2, 3, 4, 5, 6].map((l) => isLengthAvailable(l, 2))).toEqual([
      true,
      false,
      false,
      false,
      false,
    ]);
  });
  it('oct/dec/hex: доступны все длины 2–6', () => {
    [8, 10, 16].forEach((b) =>
      expect([2, 3, 4, 5, 6].every((l) => isLengthAvailable(l, b))).toBe(true),
    );
  });
});

describe('normalizeSettings', () => {
  it('уменьшает длину до максимально допустимой', () => {
    expect(normalizeSettings({ length: 5, base: 2 })).toEqual({ length: 2, base: 2 });
  });
  it('не меняет корректные настройки', () => {
    const settings = { length: 4, base: 10 } as const;
    expect(normalizeSettings(settings)).toBe(settings);
  });
});
