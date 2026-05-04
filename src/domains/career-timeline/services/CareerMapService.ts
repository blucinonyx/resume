import type { PeriodContent, PeriodMeta } from '@/shared/types/Period';

export interface PinSplit {
  pinned: PeriodMeta | null;
  rest: PeriodMeta[];
}

type MetricEntry = PeriodContent['metrics'][number];

// Pure helpers behind CareerMap.vue. The component is reactive against
// `i18n.current` + `ContentService`, but ordering / picking / range
// computation are deterministic enough to live in a static class — and
// that lets us unit-test them without a Vue runtime.
export class CareerMapService {
  /**
   * Split a chronological period list into the headline ("currently"
   * pinned) entry plus everything else, falling back to the first item
   * when no period is flagged `current: true`.
   */
  static splitByPin(periods: readonly PeriodMeta[]): PinSplit {
    if (periods.length === 0) return { pinned: null, rest: [] };
    const pinned = periods.find((p) => p.current) ?? periods[0];
    const rest = periods.filter((p) => p.slug !== pinned.slug);
    return { pinned, rest };
  }

  /** "2010 — 2024"-style label spanning the supplied periods. */
  static yearRange(periods: readonly PeriodMeta[]): string {
    if (periods.length === 0) return '';
    const earliest = Math.min(...periods.map((p) => p.startYear));
    const latest = Math.max(...periods.map((p) => p.endYear ?? p.startYear));
    return `${earliest} — ${latest}`;
  }

  /**
   * Pick up to `max` highlight metrics from a period's content, honouring
   * an explicit `highlightMetrics` order when present, else falling back
   * to the first N metrics. Drops any keys that don't match a metric.
   */
  static pickHighlights(content: PeriodContent, max = 3): MetricEntry[] {
    const keys =
      content.highlightMetrics ??
      content.metrics.slice(0, max).map((m) => m.key);
    return keys
      .map((key) => content.metrics.find((m) => m.key === key))
      .filter((m): m is MetricEntry => Boolean(m))
      .slice(0, max);
  }
}
