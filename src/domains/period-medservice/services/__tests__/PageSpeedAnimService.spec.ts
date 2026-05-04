import { describe, expect, it } from 'vitest';
import { PageSpeedAnimService } from '../PageSpeedAnimService';

describe('PageSpeedAnimService.easeOut', () => {
  it('returns 0 at p=0 and 1 at p=1', () => {
    expect(PageSpeedAnimService.easeOut(0)).toBe(0);
    expect(PageSpeedAnimService.easeOut(1)).toBe(1);
  });
});

describe('PageSpeedAnimService progress curves', () => {
  it('mobile is 0 at start, 1 at duration', () => {
    expect(PageSpeedAnimService.mobileProgress(0)).toBe(0);
    expect(PageSpeedAnimService.mobileProgress(1700)).toBe(1);
  });
  it('desktop lags by 250ms', () => {
    expect(PageSpeedAnimService.desktopProgress(0)).toBe(0);
    expect(PageSpeedAnimService.desktopProgress(250)).toBe(0);
    expect(PageSpeedAnimService.desktopProgress(1950)).toBe(1);
  });
});

describe('PageSpeedAnimService.scoreAt', () => {
  it('returns 0 at progress 0 and 100 at progress 1', () => {
    expect(PageSpeedAnimService.scoreAt(0)).toBe(0);
    expect(PageSpeedAnimService.scoreAt(1)).toBe(100);
  });
});

describe('PageSpeedAnimService.scoreColor', () => {
  it('green ≥ 90, orange ≥ 50, red below', () => {
    expect(PageSpeedAnimService.scoreColor(95)).toBe('#0cce6b');
    expect(PageSpeedAnimService.scoreColor(70)).toBe('#ffa400');
    expect(PageSpeedAnimService.scoreColor(20)).toBe('#ff4e42');
  });
});

describe('PageSpeedAnimService.dashOffset', () => {
  it('full ring at score 0, none at 100', () => {
    expect(PageSpeedAnimService.dashOffset(0)).toBe(PageSpeedAnimService.CIRC);
    expect(PageSpeedAnimService.dashOffset(100)).toBe(0);
  });
});

describe('PageSpeedAnimService.isComplete', () => {
  it('true only after both gauges reach 1', () => {
    expect(PageSpeedAnimService.isComplete(0)).toBe(false);
    expect(PageSpeedAnimService.isComplete(1700)).toBe(false); // desktop still running
    expect(PageSpeedAnimService.isComplete(2000)).toBe(true);
  });
});
