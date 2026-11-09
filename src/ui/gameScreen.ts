import { baseLabel } from '../core/config.js';
import { createDigitValidator } from '../core/createDigitValidator.js';
import { formatDuration } from '../core/format.js';
import { getScores } from '../core/scores.js';
import type { ScoreTable } from '../core/scores.js';
import type { GameState, HistoryEntry } from '../core/types.js';
import { h } from './dom.js';
import { renderLeaderboard } from './leaderboard.js';

type Actions = Readonly<{ onGuess: (guess: string) => void; onNewGame: () => void }>;

const stat = (label: string, value: string, live = false): HTMLElement =>
  h(
    'div',
    { class: 'stat' },
    h('span', { class: 'stat__label' }, label),
    h('span', live ? { class: 'stat__value', 'data-timer': '' } : { class: 'stat__value' }, value),
  );

const renderHistory = (history: readonly HistoryEntry[]): HTMLElement => {
  const items = [...history]
    .reverse()
    .map((entry, index) =>
      h(
        'li',
        { class: 'history__item' },
        h('span', { class: 'history__num' }, `#${history.length - index}`),
        h('span', { class: 'history__guess' }, entry.guess.toUpperCase()),
        h(
          'span',
          { class: 'badge badge--bull', title: 'Быки: верная цифра на своём месте' },
          `${entry.bulls} 🐂`,
        ),
        h(
          'span',
          { class: 'badge badge--cow', title: 'Коровы: цифра есть, но стоит не там' },
          `${entry.cows} 🐄`,
        ),
      ),
    );
  return h(
    'div',
    { class: 'card glass' },
    h('h2', { class: 'card__title' }, 'История попыток'),
    items.length > 0
      ? h('ol', { class: 'history' }, ...items)
      : h('p', { class: 'hint' }, 'Здесь появятся ваши попытки'),
  );
};

export const renderGame = (
  game: GameState,
  notice: string,
  scores: ScoreTable,
  actions: Actions,
): HTMLElement => {
  const { length, base } = game.settings;
  const isDigit = createDigitValidator(base);
  const isWon = game.status === 'won';
  const elapsed = (game.finishedAt ?? Date.now()) - game.startedAt;

  const input = h('input', {
    class: 'guess-input',
    type: 'text',
    inputmode: base === 16 ? 'text' : 'numeric',
    autocomplete: 'off',
    autocapitalize: 'off',
    spellcheck: 'false',
    maxlength: String(length),
    placeholder: '•'.repeat(length),
    'aria-label': 'Ваша попытка',
    disabled: isWon,
  });
  input.addEventListener('input', () => {
    input.value = [...input.value].filter(isDigit).slice(0, length).join('').toUpperCase();
  });

  const form = h(
    'form',
    {
      class: 'guess-form',
      onSubmit: (event) => {
        event.preventDefault();
        actions.onGuess(input.value);
      },
    },
    input,
    h('button', { class: 'btn btn--primary', type: 'submit', disabled: isWon }, 'Проверить'),
  );

  const lockedSettings = h(
    'div',
    { class: 'chips' },
    h('button', { type: 'button', class: 'chip chip--active', disabled: true }, baseLabel(base)),
    h('button', { type: 'button', class: 'chip chip--active', disabled: true }, `${length} цифр`),
  );

  const winCard = isWon
    ? h(
        'div',
        { class: 'win' },
        h('h2', { class: 'win__title' }, '🎉 Вы угадали!'),
        h(
          'p',
          { class: 'win__text' },
          `Число ${game.secret.toUpperCase()} · ${game.history.length} поп. · ${formatDuration(elapsed)}`,
        ),
      )
    : null;

  return h(
    'section',
    { class: 'layout' },
    h(
      'div',
      { class: 'card glass' },
      h('h1', { class: 'title title--small' }, 'Bulls & Cows'),
      lockedSettings,
      h(
        'div',
        { class: 'stats' },
        stat('Попытки', String(game.history.length)),
        stat('Время', formatDuration(elapsed), !isWon),
      ),
      form,
      h('p', { class: 'notice', role: 'status', 'aria-live': 'polite' }, notice),
      winCard,
      h(
        'button',
        { class: 'btn btn--ghost', type: 'button', onClick: actions.onNewGame },
        'Новая игра',
      ),
    ),
    h(
      'div',
      { class: 'column' },
      renderHistory(game.history),
      renderLeaderboard(game.settings, getScores(scores, game.settings)),
    ),
  );
};
