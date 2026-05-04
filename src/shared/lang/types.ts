// Shape contracts for every lang bundle. Both `en/` and `ua/` modules
// annotate their exports with these types — that way TypeScript widens
// string-literal initialisers to plain `string` and the EN ≡ UA structural
// check in `useLang.ts` succeeds (otherwise each locale's literal types
// would diverge and the BUNDLES record would never type-check).

import type { Lang } from '@/shared/types/Lang';
import type { Theme } from '@/shared/types/Theme';
import type { PeriodSlug } from '@/shared/types/Period';

export interface HeaderBundle {
  home: string;
  linkedin: string;
  email: string;
  langBtn: (l: Lang) => string;
  themeBtn: (t: Theme) => string;
  themeOption: (t: Theme) => string;
  download: string;
}

export interface CareerStripBundle {
  prevWith: (label: string) => string;
  nextWith: (label: string) => string;
  prevNone: string;
  nextNone: string;
  tab: (label: string) => string;
}

export interface RoleLayoutBundle {
  interactive: string;
  context: string;
  metrics: string;
  stack: string;
  what: string;
}

export interface BriefStintBundle {
  ticketsClosed: string;
  blurbs: Partial<Record<PeriodSlug, string>>;
}

export interface KeyappBundle {
  title: string;
  counterLbl: string;
  eps: string;
  p99: string;
  backp: string;
  start: string;
  pause: string;
  reset: string;
  sourceN: string;
  queueN: string;
  workerN: string;
  sinkN: string;
}

export interface XpayBundle {
  title: string;
  subtitle: string;
  todayLbl: string;
  successLbl: string;
  avgLbl: string;
  init: string;
  auth: string;
  threeDS: string;
  approved: string;
  declined: string;
  sectorsLbl: string;
  currency: string;
}

export interface KoshelokBundle {
  label: string;
  cardLbl: string;
  bal: string;
  tx: string;
  sources: readonly string[];
  note: string;
  currency: string;
}

export interface KarbosnabBundle {
  title: string;
  kinds: { arched: string; single: string; double: string };
  sectionLeft: string;
  sectionRight: string;
  sizesLbl: string;
  slope: string;
  length: string;
  calc: string;
  materials: { monolithic: string; profiled: string; honeycomb: string };
  color: string;
  size: string;
  mm: string;
  currency: string;
}

export interface MetricEntry {
  key: string;
  value: string;
}

export interface MedservicePageSpeedBundle {
  title: string;
  mobile: string;
  desktop: string;
  diploma: string;
  note: string;
  metrics: readonly MetricEntry[];
}

export interface MedserviceApprovalFlowBundle {
  label: string;
  diploma: string;
  stages: readonly string[];
  note: string;
  processed: string;
}

export interface MedserviceBundle {
  pageSpeed: MedservicePageSpeedBundle;
  approvalFlow: MedserviceApprovalFlowBundle;
}

export interface WizardsdevBundle {
  title: string;
  sites: string;
  months: string;
  note: string;
  stack: string;
}

export interface GoitNode {
  key: string;
  label: string;
}

export interface GoitBundle {
  title: string;
  legendUnlocked: string;
  note: string;
  nodes: readonly GoitNode[];
}

export interface MarinesBundle {
  label: string;
  sweep: string;
  contacts: string;
  heading: string;
  sea: string;
  note: string;
}

export interface StepAcademyBundle {
  title: string;
  note: string;
}

export interface CareerMapBundle {
  headline: string;
  previous: string;
  currently: string;
  deepDive: string;
}

export interface PeriodsBundle {
  keyapp: KeyappBundle;
  xpay: XpayBundle;
  koshelok: KoshelokBundle;
  karbosnab: KarbosnabBundle;
  medservice: MedserviceBundle;
  wizardsdev: WizardsdevBundle;
  goit: GoitBundle;
  marines: MarinesBundle;
  stepAcademy: StepAcademyBundle;
}
