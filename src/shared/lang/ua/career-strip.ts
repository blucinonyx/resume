import type { CareerStripBundle } from '../types';

export const careerStrip: CareerStripBundle = Object.freeze({
  prevWith: (label: string): string => `Попередній: ${label}`,
  nextWith: (label: string): string => `Наступний: ${label}`,
  prevNone: 'Більше попередніх немає',
  nextNone: 'Більше наступних немає',
  tab: (label: string): string => `Відкрити ${label}`,
});
