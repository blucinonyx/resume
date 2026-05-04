import { PeriodSlug } from '@/shared/types/Period';
import type { BriefStintBundle } from '../types';

export const briefStint: BriefStintBundle = Object.freeze({
  ticketsClosed: 'задач виконано',
  blurbs: Object.freeze({
    [PeriodSlug.ClickDealer]: 'Внутрішній портал на clickdealer.com (CPA / performance-marketing мережа, ~40 млрд показів/міс). Працював у Silex/PHP back-office, не на публічній ad-платформі.',
    [PeriodSlug.Rechout]: 'Каталог-проект на C# + Web API + Angular — закрив скоуп, далі рухався далі.',
  }),
});
