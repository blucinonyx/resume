import type { GoitBundle } from '../../types';

export const goit: GoitBundle = Object.freeze({
  title: 'Skill tree · GoIT online bootcamp',
  legendUnlocked: 'completed',
  note: 'Frontend fundamentals — HTML, CSS and JavaScript modules. Used as a structured way to fill gaps after years of self-taught backend work.',
  nodes: Object.freeze([
    { key: 'html', label: 'HTML' },
    { key: 'css', label: 'CSS' },
    { key: 'js', label: 'JavaScript' },
  ]),
});
