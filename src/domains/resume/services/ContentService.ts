import { Lang } from '@/shared/types/Lang';
import {
  type PeriodContent,
  type PeriodMeta,
  type PeriodSlug,
} from '@/shared/types/Period';
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

  static formatRange(meta: PeriodMeta, lang: Lang): string {
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsUk = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
    const months = lang === Lang.UK ? monthsUk : monthsEn;
    const present = lang === Lang.UK ? 'тепер' : 'present';

    const fromIdx = meta.startMonth - 1;
    const from = `${months[fromIdx] ?? ''} ${meta.startYear}`.trim();
    if (meta.endYear === null) return `${from} → ${present}`;
    const toIdx = (meta.endMonth ?? 1) - 1;
    const to = `${months[toIdx] ?? ''} ${meta.endYear}`.trim();
    return `${from} – ${to}`;
  }

  static shortRange(meta: PeriodMeta): string {
    const start = String(meta.startYear).slice(2);
    if (meta.endYear === null) return `${start} → now`;
    const end = String(meta.endYear).slice(2);
    return start === end ? `’${start}` : `’${start} – ’${end}`;
  }
}
