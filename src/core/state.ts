import type { GameState, Settings } from './types.js';

export type SubmitOutcome = 'accepted' | 'won' | 'invalid' | 'duplicate' | 'ignored';

export const startGame = (_settings: Settings, _secret: string, _now: number): GameState => {
  throw new Error('not implemented');
};
export const submitGuess = (
  _state: GameState,
  _guess: string,
  _now: number,
): { state: GameState; outcome: SubmitOutcome } => {
  throw new Error('not implemented');
};
