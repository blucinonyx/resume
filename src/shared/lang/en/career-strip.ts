import type { CareerStripBundle } from '../types';

// CareerStrip nav + tab tooltip strings.
export const careerStrip: CareerStripBundle = Object.freeze({
  prevWith: (label: string): string => `Previous: ${label}`,
  nextWith: (label: string): string => `Next: ${label}`,
  prevNone: 'No previous period',
  nextNone: 'No next period',
  tab: (label: string): string => `Open ${label}`,
});
