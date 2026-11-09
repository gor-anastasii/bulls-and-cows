import type { GuessResult } from './types.js';

export const evaluateGuess = (secret: string, guess: string): GuessResult => {
  const secretChars = [...secret.toLowerCase()];
  const guessChars = [...guess.toLowerCase()];
  const secretSet = new Set(secretChars);

  const bulls = guessChars.filter((char, i) => char === secretChars[i]).length;
  const common = guessChars.filter((char) => secretSet.has(char)).length;

  return { bulls, cows: common - bulls };
};
