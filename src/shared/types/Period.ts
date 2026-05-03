import type { Lang } from './Lang';

export enum PeriodType {
  Work = 'work',
  Education = 'edu',
  Military = 'mil',
}

export const TYPE_ICON: Readonly<Record<PeriodType, string>> = Object.freeze({
  [PeriodType.Work]: '💼',
  [PeriodType.Education]: '🎓',
  [PeriodType.Military]: '⚓',
});

export enum PeriodSlug {
  Keyapp = 'keyapp',
  KoshelOk = 'koshelok',
  Xpay = 'xpay',
  ClickDealer = 'clickdealer',
  MedService = 'medservice',
  Karbosnab = 'karbosnab',
  WizardsDev = 'wizardsdev',
  FreelanceLate = 'freelance-late',
  Marines = 'marines',
  FreelanceEarly = 'freelance-early',
  Rechout = 'rechout',
  GoIT = 'goit',
  MykolaivBachelor = 'mykolaiv-bachelor',
  MykolaivAssociate = 'mykolaiv-associate',
  StepAcademy = 'step-academy',
}

export interface PeriodMeta {
  slug: PeriodSlug;
  type: PeriodType;
  startYear: number;
  startMonth: number;
  endYear: number | null; // null = present
  endMonth: number | null;
  current?: boolean;
}

export interface PeriodContent {
  title: string;
  subtitle: string;
  location: string | null;
  url: string | null;
  context: string | null;
  bullets: string[];
  metrics: { key: string; value: string }[];
  stack: string[];
  quote: string | null;
  /**
   * Short description (≤ 250 chars) shown in the pinned hero card.
   * May contain `<b>` tags around numbers for emphasis — rendered via `v-html`
   * (content is project-internal, no sanitization required).
   * Falls back to `context` when absent.
   */
  pinnedDescription?: string;
  /**
   * Ordered list of `metric.key` values to surface in the pinned hero (top-3 slots).
   * When absent, the hero falls back to `metrics.slice(0, 3)`.
   */
  highlightMetrics?: readonly string[];
}

export type PeriodContentMap = Readonly<Record<PeriodSlug, PeriodContent>>;
export type LocalisedContent = Readonly<Record<Lang, PeriodContentMap>>;
