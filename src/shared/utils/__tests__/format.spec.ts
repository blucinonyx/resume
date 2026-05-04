import { describe, expect, it } from 'vitest';
import { FormatService } from '../format';

describe('FormatService.stepNumber', () => {
  it('zero-pads single digits to width 2 by default', () => {
    expect(FormatService.stepNumber(0)).toBe('01');
    expect(FormatService.stepNumber(8)).toBe('09');
  });
  it('does not pad two-digit values', () => {
    expect(FormatService.stepNumber(9)).toBe('10');
    expect(FormatService.stepNumber(98)).toBe('99');
  });
  it('respects custom width', () => {
    expect(FormatService.stepNumber(0, 3)).toBe('001');
  });
});

describe('FormatService.thousands', () => {
  it('groups large numbers in en-US locale', () => {
    expect(FormatService.thousands(1_234_567)).toBe('1,234,567');
  });
  it('handles small numbers as bare digits', () => {
    expect(FormatService.thousands(42)).toBe('42');
  });
});

describe('FormatService.currency2dp', () => {
  it('always renders two fraction digits', () => {
    expect(FormatService.currency2dp(1234)).toBe('1,234.00');
    expect(FormatService.currency2dp(0.5)).toBe('0.50');
    expect(FormatService.currency2dp(99.999)).toBe('100.00');
  });
});

describe('FormatService.pad', () => {
  it('pads to default width 2', () => {
    expect(FormatService.pad(0)).toBe('00');
    expect(FormatService.pad(7)).toBe('07');
  });
  it('pads to custom width', () => {
    expect(FormatService.pad(7, 3)).toBe('007');
  });
});
