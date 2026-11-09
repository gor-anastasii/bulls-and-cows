import { LEADERBOARD_SIZE } from './config.js';
import type { Settings } from './types.js';

export type ScoreEntry = Readonly<{ attempts: number; timeMs: number; date: number }>;
export type ScoreTable = Readonly<Record<string, readonly ScoreEntry[]>>;

export const settingsKey = ({ length, base }: Settings): string => `${length}-${base}`;

export const compareScores = (a: ScoreEntry, b: ScoreEntry): number =>
  a.attempts - b.attempts || a.timeMs - b.timeMs;

export const getScores = (table: ScoreTable, settings: Settings): readonly ScoreEntry[] =>
  table[settingsKey(settings)] ?? [];

export const addScore = (
  table: ScoreTable,
  settings: Settings,
  entry: ScoreEntry,
  limit: number = LEADERBOARD_SIZE,
): ScoreTable => ({
  ...table,
  [settingsKey(settings)]: [...getScores(table, settings), entry]
    .sort(compareScores)
    .slice(0, limit),
});
