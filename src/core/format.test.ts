import { describe, expect, it } from 'vitest';
import { formatDuration } from './format.js';

describe('formatDuration', () => {
  it.each([
    [0, '0:00.0'],
    [599, '0:00.5'],
    [65_400, '1:05.4'],
    [-50, '0:00.0'],
  ])('%i мс → %s', (ms, expected) => {
    expect(formatDuration(ms)).toBe(expected);
  });
});
