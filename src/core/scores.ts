import type { Settings } from './types.js';

export type ScoreEntry = Readonly<{ attempts: number; timeMs: number; date: number }>;
export type ScoreTable = Readonly<Record<string, readonly ScoreEntry[]>>;

export const settingsKey = (_settings: Settings): string => {
  throw new Error('not implemented');
};
export const compareScores = (_a: ScoreEntry, _b: ScoreEntry): number => {
  throw new Error('not implemented');
};
export const getScores = (_table: ScoreTable, _settings: Settings): readonly ScoreEntry[] => {
  throw new Error('not implemented');
};
export const addScore = (
  _table: ScoreTable,
  _settings: Settings,
  _entry: ScoreEntry,
  _limit?: number,
): ScoreTable => {
  throw new Error('not implemented');
};
