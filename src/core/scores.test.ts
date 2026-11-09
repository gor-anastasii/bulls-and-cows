import { describe, expect, it } from 'vitest';
import { addScore, compareScores, getScores, settingsKey } from './scores.js';

const entry = (attempts: number, timeMs: number) => ({ attempts, timeMs, date: 0 });
const dec4 = { length: 4, base: 10 } as const;
const hex5 = { length: 5, base: 16 } as const;

describe('scores', () => {
  it('ключ зависит от длины и системы счисления', () => {
    expect(settingsKey(dec4)).not.toBe(settingsKey(hex5));
  });
  it('сравнение: меньше попыток лучше, при равенстве меньше время', () => {
    expect(compareScores(entry(3, 9000), entry(5, 1000))).toBeLessThan(0);
    expect(compareScores(entry(4, 1000), entry(4, 2000))).toBeLessThan(0);
  });
  it('добавляет и сортирует результаты', () => {
    const table = [entry(7, 1), entry(3, 5), entry(5, 2)].reduce(
      (acc, e) => addScore(acc, dec4, e),
      {},
    );
    expect(getScores(table, dec4).map((e) => e.attempts)).toEqual([3, 5, 7]);
  });
  it('ограничивает таблицу топ-N', () => {
    const table = [1, 2, 3, 4].reduce((acc, n) => addScore(acc, dec4, entry(n, 0), 2), {});
    expect(getScores(table, dec4).map((e) => e.attempts)).toEqual([1, 2]);
  });
  it('таблицы для разных настроек не смешиваются', () => {
    const table = addScore(addScore({}, dec4, entry(3, 1)), hex5, entry(9, 1));
    expect(getScores(table, dec4)).toHaveLength(1);
    expect(getScores(table, hex5)[0].attempts).toBe(9);
  });
  it('не мутирует исходную таблицу', () => {
    const table = addScore({}, dec4, entry(3, 1));
    const next = addScore(table, dec4, entry(2, 1));
    expect(getScores(table, dec4)).toHaveLength(1);
    expect(next).not.toBe(table);
  });
  it('пустая таблица для неизвестных настроек', () => {
    expect(getScores({}, dec4)).toEqual([]);
  });
});
