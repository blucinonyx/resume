import { describe, expect, it } from 'vitest';
import { PeriodType, type PeriodMeta, type PeriodContent, PeriodSlug } from '@/shared/types/Period';
import { CareerMapService } from '../CareerMapService';

const meta = (slug: PeriodSlug, year: number, current = false): PeriodMeta => ({
  slug, type: PeriodType.Work, startYear: year, startMonth: 1,
  endYear: year + 1, endMonth: 1, current,
});

describe('CareerMapService.splitByPin', () => {
  it('returns empty split for empty input', () => {
    expect(CareerMapService.splitByPin([])).toEqual({ pinned: null, rest: [] });
  });
  it('promotes the period flagged current', () => {
    const list = [meta(PeriodSlug.Keyapp, 2022, true), meta(PeriodSlug.Xpay, 2021), meta(PeriodSlug.MedService, 2020)];
    const out = CareerMapService.splitByPin(list);
    expect(out.pinned?.slug).toBe(PeriodSlug.Keyapp);
    expect(out.rest.map((p) => p.slug)).toEqual([PeriodSlug.Xpay, PeriodSlug.MedService]);
  });
  it('falls back to first when no flagged current', () => {
    const list = [meta(PeriodSlug.Xpay, 2021), meta(PeriodSlug.MedService, 2020)];
    expect(CareerMapService.splitByPin(list).pinned?.slug).toBe(PeriodSlug.Xpay);
  });
});

describe('CareerMapService.yearRange', () => {
  it('spans earliest start to latest end', () => {
    const list = [meta(PeriodSlug.Xpay, 2021), meta(PeriodSlug.MedService, 2010)];
    expect(CareerMapService.yearRange(list)).toBe('2010 — 2022');
  });
  it('returns empty string for empty list', () => {
    expect(CareerMapService.yearRange([])).toBe('');
  });
});

describe('CareerMapService.pickHighlights', () => {
  const content = {
    metrics: [
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
      { key: 'c', value: '3' },
      { key: 'd', value: '4' },
    ],
  } as PeriodContent;

  it('uses first 3 metrics by default', () => {
    expect(CareerMapService.pickHighlights(content).map((m) => m.key)).toEqual(['a', 'b', 'c']);
  });
  it('honours highlightMetrics order', () => {
    const out = CareerMapService.pickHighlights({ ...content, highlightMetrics: ['d', 'a'] });
    expect(out.map((m) => m.key)).toEqual(['d', 'a']);
  });
  it('drops keys that do not exist', () => {
    const out = CareerMapService.pickHighlights({ ...content, highlightMetrics: ['z', 'a'] });
    expect(out.map((m) => m.key)).toEqual(['a']);
  });
});
