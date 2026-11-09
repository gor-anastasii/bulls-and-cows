import { STORAGE_KEY } from '../core/config.js';
import type { ScoreTable } from '../core/scores.js';

export const loadScores = (): ScoreTable => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return typeof parsed === 'object' && parsed !== null ? (parsed as ScoreTable) : {};
  } catch {
    return {};
  }
};

export const saveScores = (table: ScoreTable): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(table));
  } catch {
    console.log('хранилище недоступно: игра продолжает работать без сохранения');
  }
};
