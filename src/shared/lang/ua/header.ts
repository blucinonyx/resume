import { Lang } from '@/shared/types/Lang';
import { THEME_LABELS, type Theme } from '@/shared/types/Theme';
import type { HeaderBundle } from '../types';

export const header: HeaderBundle = Object.freeze({
  home: 'На головну — повернутись до career-timeline',
  linkedin: 'LinkedIn — основний канал звʼязку',
  email: 'Написати email · blucinonyx@gmail.com',
  langBtn: (l: Lang): string => `Переключити інтерфейс на ${l === Lang.EN ? 'англійську' : 'українську'}`,
  themeBtn: (t: Theme): string => `Тема: ${THEME_LABELS[t]} · клік щоб обрати іншу`,
  themeOption: (t: Theme): string => `Переключити на тему ${THEME_LABELS[t]}`,
  download: 'Завантажити CV у PDF',
});
