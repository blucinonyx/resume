import { PeriodSlug } from '@/shared/types/Period';
import type { BriefStintBundle } from '../types';

// Strings for BriefStint — the shared visual used by short stints
// (ClickDealer, Rechout) that don't justify their own custom widget.
export const briefStint: BriefStintBundle = Object.freeze({
  ticketsClosed: 'tasks closed',
  blurbs: Object.freeze({
    [PeriodSlug.ClickDealer]: 'Internal portal at clickdealer.com (CPA / performance-marketing network, ~40B monthly impressions). Worked on Silex/PHP back-office, not the public ad platform.',
    [PeriodSlug.Rechout]: 'Catalogue project on C# + Web API + Angular — closed the assigned scope, then moved on.',
  }),
});
