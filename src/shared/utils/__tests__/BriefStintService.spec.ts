import { describe, expect, it } from 'vitest';
import { PeriodSlug, type PeriodContent } from '@/shared/types/Period';
import { BriefStintService } from '../BriefStintService';

const fakeContent = {
  title: 'Foo',
  subtitle: 'Engineer',
  context: 'a long context that may serve as a fallback blurb',
  stack: ['ts', 'vue'],
  bullets: [],
  metrics: [],
  location: null,
  url: null,
  quote: null,
} as unknown as PeriodContent;

describe('BriefStintService.parseSlug', () => {
  it('returns null for missing/invalid', () => {
    expect(BriefStintService.parseSlug(undefined)).toBeNull();
    expect(BriefStintService.parseSlug('not-a-slug')).toBeNull();
  });
  it('round-trips a real slug', () => {
    expect(BriefStintService.parseSlug('clickdealer')).toBe(PeriodSlug.ClickDealer);
  });
  it('handles array params (vue-router edge)', () => {
    expect(BriefStintService.parseSlug(['rechout', 'extra'])).toBe(PeriodSlug.Rechout);
  });
});

describe('BriefStintService.ticketCount', () => {
  it('uses curated value for ClickDealer', () => {
    expect(BriefStintService.ticketCount(PeriodSlug.ClickDealer)).toBe(12);
  });
  it('uses curated value for Rechout', () => {
    expect(BriefStintService.ticketCount(PeriodSlug.Rechout)).toBe(8);
  });
  it('falls back to default for other slugs', () => {
    expect(BriefStintService.ticketCount(PeriodSlug.Keyapp)).toBe(8);
  });
  it('returns default for null', () => {
    expect(BriefStintService.ticketCount(null)).toBe(8);
  });
});

describe('BriefStintService.headerLabel', () => {
  it('joins title + subtitle + range', () => {
    expect(BriefStintService.headerLabel(fakeContent, '2020 — 2021'))
      .toBe('Foo · Engineer · 2020 — 2021');
  });
  it('returns empty when content is null', () => {
    expect(BriefStintService.headerLabel(null, '')).toBe('');
  });
});

describe('BriefStintService.blurb', () => {
  it('prefers the curated blurb', () => {
    const blurbs = { [PeriodSlug.ClickDealer]: 'curated' };
    expect(BriefStintService.blurb(PeriodSlug.ClickDealer, blurbs, fakeContent)).toBe('curated');
  });
  it('falls back to content.context', () => {
    expect(BriefStintService.blurb(PeriodSlug.Keyapp, {}, fakeContent))
      .toBe('a long context that may serve as a fallback blurb');
  });
  it('returns empty string for null slug', () => {
    expect(BriefStintService.blurb(null, {}, fakeContent)).toBe('');
  });
});

describe('BriefStintService.stack', () => {
  it('returns content.stack', () => {
    expect(BriefStintService.stack(fakeContent)).toEqual(['ts', 'vue']);
  });
  it('returns empty for null', () => {
    expect(BriefStintService.stack(null)).toEqual([]);
  });
});
