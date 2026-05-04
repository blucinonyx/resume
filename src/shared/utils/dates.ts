import { Lang } from '@/shared/types/Lang';
import type { PeriodMeta } from '@/shared/types/Period';

const MONTHS_EN: readonly string[] = Object.freeze([
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]);

const MONTHS_UK: readonly string[] = Object.freeze([
  'Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер',
  'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру',
]);

const PRESENT_LABEL: Readonly<Record<Lang, string>> = Object.freeze({
  [Lang.EN]: 'present',
  [Lang.UK]: 'тепер',
});

export class DateFormatService {
  /**
   * Format a period's start/end into "Jan 2019 – Feb 2021" or
   * "Січ 2019 → тепер" for open-ended ranges. Mirrors the existing
   * ContentService behaviour exactly (em-dash for closed, arrow for open).
   */
  static formatRange(meta: PeriodMeta, lang: Lang): string {
    const months = lang === Lang.UK ? MONTHS_UK : MONTHS_EN;
    const fromIdx = meta.startMonth - 1;
    const from = `${months[fromIdx] ?? ''} ${meta.startYear}`.trim();
    if (meta.endYear === null) {
      return `${from} → ${PRESENT_LABEL[lang]}`;
    }
    const toIdx = (meta.endMonth ?? 1) - 1;
    const to = `${months[toIdx] ?? ''} ${meta.endYear}`.trim();
    return `${from} – ${to}`;
  }

  /**
   * Compact year-only range used in the CareerStrip tab (e.g. "2019—2021"
   * em-dash, or "2021 → now" / single year).
   */
  static shortRange(meta: PeriodMeta): string {
    if (meta.endYear === null) return `${meta.startYear} → now`;
    if (meta.startYear === meta.endYear) return String(meta.startYear);
    return `${meta.startYear}—${meta.endYear}`;
  }
}
