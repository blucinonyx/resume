import { describe, expect, it } from 'vitest';
import { Lang } from '@/shared/types/Lang';
import { PeriodSlug } from '@/shared/types/Period';
import { ContentService } from '../ContentService';

describe('ContentService.all', () => {
  it('returns the full chronological registry of periods', () => {
    const periods = ContentService.all();
    expect(periods.length).toBeGreaterThan(0);
    expect(periods.every((p) => Object.values(PeriodSlug).includes(p.slug))).toBe(true);
  });
});

describe('ContentService.meta', () => {
  it('looks up a period by slug', () => {
    const meta = ContentService.meta(PeriodSlug.Keyapp);
    expect(meta).not.toBeNull();
    expect(meta?.slug).toBe(PeriodSlug.Keyapp);
  });
});

describe('ContentService.content', () => {
  it('returns content for both locales (some periods share a brand title)', () => {
    const en = ContentService.content(PeriodSlug.MedService, Lang.EN);
    const ua = ContentService.content(PeriodSlug.MedService, Lang.UK);
    expect(en?.title).toBeTruthy();
    expect(ua?.title).toBeTruthy();
    // Context fields are localised even when titles are brand names.
    expect(en?.context).not.toBe(ua?.context);
  });
});

describe('ContentService.formatRange', () => {
  it('delegates to DateFormatService — closed range with em-dash', () => {
    const meta = ContentService.meta(PeriodSlug.MedService)!;
    const out = ContentService.formatRange(meta, Lang.EN);
    expect(out).toContain('–'); // em-dash
  });
});

describe('ContentService.shortRange', () => {
  it('formats a single-year period as just the year', () => {
    const meta = ContentService.meta(PeriodSlug.ClickDealer);
    if (meta && meta.startYear === meta.endYear) {
      expect(ContentService.shortRange(meta)).toBe(String(meta.startYear));
    }
  });
});
