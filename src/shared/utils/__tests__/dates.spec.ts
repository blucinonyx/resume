import { describe, expect, it } from 'vitest';
import { Lang } from '@/shared/types/Lang';
import { PeriodType, type PeriodMeta } from '@/shared/types/Period';
import { DateFormatService } from '../dates';

const closed: PeriodMeta = {
  slug: 'medservice' as PeriodMeta['slug'],
  type: PeriodType.Work,
  startYear: 2019,
  startMonth: 2,
  endYear: 2021,
  endMonth: 1,
};

const open: PeriodMeta = {
  slug: 'keyapp' as PeriodMeta['slug'],
  type: PeriodType.Work,
  startYear: 2022,
  startMonth: 6,
  endYear: null,
  endMonth: null,
  current: true,
};

describe('DateFormatService.formatRange', () => {
  it('renders English closed range with em-dash separator', () => {
    expect(DateFormatService.formatRange(closed, Lang.EN)).toBe('Feb 2019 – Jan 2021');
  });
  it('renders Ukrainian closed range with localised months', () => {
    expect(DateFormatService.formatRange(closed, Lang.UK)).toBe('Лют 2019 – Січ 2021');
  });
  it('renders English open-ended range with → and "present"', () => {
    expect(DateFormatService.formatRange(open, Lang.EN)).toBe('Jun 2022 → present');
  });
  it('renders Ukrainian open-ended range with "тепер"', () => {
    expect(DateFormatService.formatRange(open, Lang.UK)).toBe('Чер 2022 → тепер');
  });
});

describe('DateFormatService.shortRange', () => {
  it('shows "now" arrow for open periods', () => {
    expect(DateFormatService.shortRange(open)).toBe('2022 → now');
  });
  it('collapses single-year ranges', () => {
    const single: PeriodMeta = { ...closed, startYear: 2021, endYear: 2021 };
    expect(DateFormatService.shortRange(single)).toBe('2021');
  });
  it('joins two years with em-dash', () => {
    expect(DateFormatService.shortRange(closed)).toBe('2019—2021');
  });
});
