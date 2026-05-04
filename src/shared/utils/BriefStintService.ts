import { PeriodSlug, type PeriodContent, type PeriodMeta } from '@/shared/types/Period';

// Per-slug ticket counters used in the BriefStint counter widget. Picked
// for narrative effect, not real numbers — small integers that feel
// believable for a brief stint.
const TICKETS_BY_SLUG: Partial<Record<PeriodSlug, number>> = Object.freeze({
  [PeriodSlug.ClickDealer]: 12,
  [PeriodSlug.Rechout]: 8,
});
const DEFAULT_TICKETS = 8;

export class BriefStintService {
  static ticketCount(slug: PeriodSlug | null): number {
    if (!slug) return DEFAULT_TICKETS;
    return TICKETS_BY_SLUG[slug] ?? DEFAULT_TICKETS;
  }

  /** Header line: "Title · subtitle · range" — empty when content is missing. */
  static headerLabel(content: PeriodContent | null, range: string): string {
    if (!content) return '';
    return `${content.title} · ${content.subtitle} · ${range}`;
  }

  /** Pick the curated blurb for this slug, fall back to the period's context. */
  static blurb(
    slug: PeriodSlug | null,
    blurbs: Partial<Record<PeriodSlug, string>>,
    content: PeriodContent | null,
  ): string {
    if (!slug) return '';
    return blurbs[slug] ?? content?.context ?? '';
  }

  /** Resolve a string slug from a router param to a typed PeriodSlug or null. */
  static parseSlug(raw: string | string[] | undefined): PeriodSlug | null {
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (!value) return null;
    return Object.values(PeriodSlug).includes(value as PeriodSlug)
      ? (value as PeriodSlug)
      : null;
  }

  static stack(content: PeriodContent | null): readonly string[] {
    return content?.stack ?? [];
  }

  // Re-export types used by callers (avoids component re-importing them).
  static asMeta(meta: PeriodMeta | null): PeriodMeta | null {
    return meta;
  }
}
