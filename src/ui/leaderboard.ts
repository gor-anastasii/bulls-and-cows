import { baseLabel } from '../core/config.js';
import { formatDuration } from '../core/format.js';
import type { ScoreEntry } from '../core/scores.js';
import type { Settings } from '../core/types.js';
import { h } from './dom.js';

export const renderLeaderboard = (
  settings: Settings,
  entries: readonly ScoreEntry[],
): HTMLElement => {
  const rows = entries.map((entry, index) =>
    h(
      'li',
      { class: 'lb-row' },
      h('span', { class: 'lb-rank' }, String(index + 1)),
      h('span', { class: 'lb-attempts' }, `${entry.attempts} поп.`),
      h('span', { class: 'lb-time' }, formatDuration(entry.timeMs)),
    ),
  );
  return h(
    'aside',
    { class: 'card glass' },
    h('h2', { class: 'card__title' }, 'Таблица рекордов'),
    h('span', { class: 'badge' }, `${baseLabel(settings.base)} · ${settings.length} цифр`),
    rows.length > 0
      ? h('ol', { class: 'lb-list' }, ...rows)
      : h('p', { class: 'hint' }, 'Пока пусто. Станьте первым!'),
  );
};
