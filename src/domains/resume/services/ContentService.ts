import { Lang } from '@/shared/types/Lang';
import {
  type PeriodContent,
  type PeriodMeta,
  type PeriodSlug,
} from '@/shared/types/Period';
import { DateFormatService } from '@/shared/utils/dates';
import { CONTENT_EN } from '../data/content.en';
import { CONTENT_UK } from '../data/content.uk';
import { PERIODS, PERIOD_BY_SLUG } from '../data/periods';

const CONTENT_BY_LANG = Object.freeze({
  [Lang.EN]: CONTENT_EN,
  [Lang.UK]: CONTENT_UK,
});

export class ContentService {
  static all(): readonly PeriodMeta[] {
    return PERIODS;
  }

  static meta(slug: PeriodSlug): PeriodMeta | null {
    return PERIOD_BY_SLUG.get(slug) ?? null;
  }

  static content(slug: PeriodSlug, lang: Lang): PeriodContent | null {
    const map = CONTENT_BY_LANG[lang];
    return map[slug] ?? null;
  }

  // Date formatting now lives in shared/utils/dates so it can be unit-
  // tested without pulling the resume content map. Thin delegators keep
  // the existing call sites (`ContentService.formatRange/...`) working.
  static formatRange(meta: PeriodMeta, lang: Lang): string {
    return DateFormatService.formatRange(meta, lang);
  }

  static shortRange(meta: PeriodMeta): string {
    return DateFormatService.shortRange(meta);
  }
}
