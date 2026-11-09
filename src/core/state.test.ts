import { describe, expect, it } from 'vitest';
import { startGame, submitGuess } from './state.js';

const fresh = () => startGame({ length: 4, base: 10 }, '1234', 1000);

describe('startGame', () => {
  it('создаёт игру в статусе playing с пустой историей', () => {
    expect(fresh()).toMatchObject({
      status: 'playing',
      history: [],
      startedAt: 1000,
      finishedAt: null,
    });
  });
});

describe('submitGuess', () => {
  it('добавляет запись с bulls/cows', () => {
    const { state, outcome } = submitGuess(fresh(), '1243', 2000);
    expect(outcome).toBe('accepted');
    expect(state.history).toEqual([{ guess: '1243', bulls: 2, cows: 2 }]);
  });

  it('не мутирует предыдущее состояние и создаёт новый массив', () => {
    const before = fresh();
    const snapshot = structuredClone(before);
    const { state } = submitGuess(before, '5678', 2000);
    expect(before).toEqual(snapshot);
    expect(state.history).not.toBe(before.history);
  });

  it('старые записи сохраняются', () => {
    const first = submitGuess(fresh(), '5678', 2000).state;
    const second = submitGuess(first, '1243', 3000).state;
    expect(second.history.map((e) => e.guess)).toEqual(['5678', '1243']);
  });

  it('повтор не задваивает запись и возвращает то же состояние', () => {
    const first = submitGuess(fresh(), '5678', 2000).state;
    const { state, outcome } = submitGuess(first, '5678', 3000);
    expect(outcome).toBe('duplicate');
    expect(state).toBe(first);
  });

  it('повтор hex в другом регистре тоже считается дублем', () => {
    const start = startGame({ length: 4, base: 16 }, '0123', 0);
    const first = submitGuess(start, 'AB45', 1).state;
    expect(submitGuess(first, 'ab45', 2).outcome).toBe('duplicate');
  });

  it('невалидная попытка не меняет состояние', () => {
    const start = fresh();
    ['12', '1123', 'abcd', ''].forEach((guess) => {
      const result = submitGuess(start, guess, 2000);
      expect(result.outcome).toBe('invalid');
      expect(result.state).toBe(start);
    });
  });

  it('угадывание завершает игру и фиксирует время', () => {
    const { state, outcome } = submitGuess(fresh(), '1234', 5000);
    expect(outcome).toBe('won');
    expect(state).toMatchObject({ status: 'won', finishedAt: 5000 });
  });

  it('после победы попытки игнорируются', () => {
    const won = submitGuess(fresh(), '1234', 5000).state;
    const result = submitGuess(won, '5678', 6000);
    expect(result.outcome).toBe('ignored');
    expect(result.state).toBe(won);
  });
});
