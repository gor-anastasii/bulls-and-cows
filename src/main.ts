import { DEFAULT_SETTINGS } from './core/config.js';
import { formatDuration } from './core/format.js';
import { generateSecret } from './core/generateSecret.js';
import { addScore } from './core/scores.js';
import type { ScoreTable } from './core/scores.js';
import { startGame, submitGuess } from './core/state.js';
import type { SubmitOutcome } from './core/state.js';
import type { GameState, Settings } from './core/types.js';
import { h } from './ui/dom.js';
import { renderGame } from './ui/gameScreen.js';
import { renderSettings } from './ui/settingsScreen.js';
import { loadScores, saveScores } from './ui/storage.js';

type View =
  { screen: 'settings'; settings: Settings } | { screen: 'game'; game: GameState; notice: string };

let view: View = { screen: 'settings', settings: DEFAULT_SETTINGS };
let scores: ScoreTable = loadScores();
let tickerId: number | undefined;

const app = h('main', { class: 'app' });
document.body.append(
  h(
    'div',
    { class: 'bg', 'aria-hidden': 'true' },
    h('span', { class: 'blob blob--violet' }),
    h('span', { class: 'blob blob--blue' }),
    h('span', { class: 'blob blob--pink' }),
  ),
  app,
);

const noticeFor = (outcome: SubmitOutcome, { length }: Settings): string =>
  ({
    accepted: '',
    won: '',
    ignored: '',
    invalid: `Нужно ввести ровно ${length} разных цифр выбранной системы`,
    duplicate: 'Такая попытка уже была — попробуйте другое число',
  })[outcome];

const stopTicker = (): void => {
  if (tickerId !== undefined) window.clearInterval(tickerId);
  tickerId = undefined;
};

const startTicker = (): void => {
  stopTicker();
  tickerId = window.setInterval(() => {
    if (view.screen !== 'game' || view.game.status !== 'playing') return;
    const timer = document.querySelector('[data-timer]');
    if (timer) timer.textContent = formatDuration(Date.now() - view.game.startedAt);
  }, 100);
};

const render = (): void => {
  app.replaceChildren(
    view.screen === 'settings'
      ? renderSettings(view.settings, scores, {
          onChange: handleSettingsChange,
          onStart: handleStart,
        })
      : renderGame(view.game, view.notice, scores, {
          onGuess: handleGuess,
          onNewGame: handleNewGame,
        }),
  );
  document.querySelector<HTMLInputElement>('.guess-input')?.focus();
};

const handleSettingsChange = (settings: Settings): void => {
  view = { screen: 'settings', settings };
  render();
};

const handleStart = (settings: Settings): void => {
  const secret = generateSecret(settings.length, settings.base);
  view = { screen: 'game', game: startGame(settings, secret, Date.now()), notice: '' };
  startTicker();
  render();
};

const handleGuess = (rawGuess: string): void => {
  if (view.screen !== 'game') return;
  const now = Date.now();
  const { state, outcome } = submitGuess(view.game, rawGuess, now);

  if (outcome === 'won') {
    stopTicker();
    scores = addScore(scores, state.settings, {
      attempts: state.history.length,
      timeMs: (state.finishedAt ?? now) - state.startedAt,
      date: now,
    });
    saveScores(scores);
  }

  view = { screen: 'game', game: state, notice: noticeFor(outcome, state.settings) };
  render();
};

const handleNewGame = (): void => {
  stopTicker();
  view = {
    screen: 'settings',
    settings: view.screen === 'game' ? view.game.settings : DEFAULT_SETTINGS,
  };
  render();
};

render();
