import { BASES, LENGTHS } from '../core/config.js';
import { countPossibleSecrets } from '../core/countPossibleSecrets.js';
import { getScores } from '../core/scores.js';
import type { ScoreTable } from '../core/scores.js';
import { isLengthAvailable, normalizeSettings } from '../core/settings.js';
import type { Settings } from '../core/types.js';
import { h } from './dom.js';
import { renderLeaderboard } from './leaderboard.js';

type Actions = Readonly<{
  onChange: (settings: Settings) => void;
  onStart: (settings: Settings) => void;
}>;

const chipClass = (active: boolean): string => (active ? 'chip chip--active' : 'chip');

const field = (label: string, controls: readonly HTMLElement[]): HTMLElement =>
  h(
    'div',
    { class: 'field' },
    h('span', { class: 'field__label' }, label),
    h('div', { class: 'chips' }, ...controls),
  );

export const renderSettings = (
  settings: Settings,
  scores: ScoreTable,
  actions: Actions,
): HTMLElement => {
  const baseChips = BASES.map(({ value, label }) =>
    h(
      'button',
      {
        type: 'button',
        class: chipClass(value === settings.base),
        'aria-pressed': String(value === settings.base),
        onClick: () => actions.onChange(normalizeSettings({ ...settings, base: value })),
      },
      label,
    ),
  );

  const lengthChips = LENGTHS.map((length) =>
    h(
      'button',
      {
        type: 'button',
        class: chipClass(length === settings.length),
        'aria-pressed': String(length === settings.length),
        disabled: !isLengthAvailable(length, settings.base),
        onClick: () => actions.onChange({ ...settings, length }),
      },
      String(length),
    ),
  );

  const total = countPossibleSecrets(settings.length, settings.base).toLocaleString('ru-RU');

  return h(
    'section',
    { class: 'layout' },
    h(
      'div',
      { class: 'card glass' },
      h('h1', { class: 'title' }, 'Bulls & Cows'),
      h('p', { class: 'subtitle' }, 'Угадайте секретное число из уникальных цифр'),
      field('Система счисления', baseChips),
      field('Длина числа', lengthChips),
      h('p', { class: 'hint' }, `Возможных секретных чисел: ${total}`),
      h(
        'button',
        { class: 'btn btn--primary', type: 'button', onClick: () => actions.onStart(settings) },
        'Начать игру',
      ),
    ),
    renderLeaderboard(settings, getScores(scores, settings)),
  );
};
