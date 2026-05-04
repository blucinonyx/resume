import { Lang } from '@/shared/types/Lang';
import { THEME_LABELS, type Theme } from '@/shared/types/Theme';
import type { HeaderBundle } from '../types';

// Tooltip strings for AppHeader. Functions cover variable interpolation —
// no template-side branching required.
export const header: HeaderBundle = Object.freeze({
  home: 'Home — back to the career timeline',
  linkedin: 'LinkedIn — preferred way to reach me',
  email: 'Send email · blucinonyx@gmail.com',
  langBtn: (l: Lang): string => `Switch interface to ${l === Lang.EN ? 'English' : 'Ukrainian'}`,
  themeBtn: (t: Theme): string => `Theme: ${THEME_LABELS[t]} · click to choose another`,
  themeOption: (t: Theme): string => `Switch to ${THEME_LABELS[t]} theme`,
  download: 'Download CV as PDF',
});
