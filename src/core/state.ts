import { evaluateGuess } from './evaluateGuess.js';
import { isValidGuess } from './isValidGuess.js';
import type { GameState, Settings } from './types.js';

export type SubmitOutcome = 'accepted' | 'won' | 'invalid' | 'duplicate' | 'ignored';

export const startGame = (settings: Settings, secret: string, now: number): GameState => ({
  settings,
  secret,
  history: [],
  status: 'playing',
  startedAt: now,
  finishedAt: null,
});

export const submitGuess = (
  state: GameState,
  rawGuess: string,
  now: number,
): { state: GameState; outcome: SubmitOutcome } => {
  const guess = rawGuess.toLowerCase();
  const { length, base } = state.settings;

  if (state.status !== 'playing') return { state, outcome: 'ignored' };
  if (!isValidGuess(guess, length, base)) return { state, outcome: 'invalid' };
  if (state.history.some((entry) => entry.guess === guess)) return { state, outcome: 'duplicate' };

  const { bulls, cows } = evaluateGuess(state.secret, guess);
  const won = bulls === length;

  return {
    state: {
      ...state,
      history: [...state.history, { guess, bulls, cows }],
      status: won ? 'won' : 'playing',
      finishedAt: won ? now : null,
    },
    outcome: won ? 'won' : 'accepted',
  };
};
