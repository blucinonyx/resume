import type { GoitBundle } from '../../types';

export const goit: GoitBundle = Object.freeze({
  title: 'Skill tree · GoIT bootcamp',
  legendUnlocked: 'пройдено',
  note: 'Frontend-фундамент — модулі HTML, CSS, JavaScript. Структурований спосіб закрити прогалини після років самонавчання на бекенді.',
  nodes: Object.freeze([
    { key: 'html', label: 'HTML' },
    { key: 'css', label: 'CSS' },
    { key: 'js', label: 'JavaScript' },
  ]),
});
