export type Base = 2 | 8 | 10 | 16;
export type Settings = Readonly<{ length: number; base: Base }>;
export type GuessResult = Readonly<{ bulls: number; cows: number }>;
export type HistoryEntry = Readonly<{ guess: string; bulls: number; cows: number }>;
export type GameStatus = 'playing' | 'won';
export type GameState = Readonly<{
  settings: Settings;
  secret: string;
  history: readonly HistoryEntry[];
  status: GameStatus;
  startedAt: number;
  finishedAt: number | null;
}>;
