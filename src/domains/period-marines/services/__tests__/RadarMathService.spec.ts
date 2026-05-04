import { describe, expect, it } from 'vitest';
import { RadarMathService } from '../RadarMathService';

describe('RadarMathService.contactPosition', () => {
  it('places 0° contact directly east of centre', () => {
    const p = RadarMathService.contactPosition(0, 60);
    expect(p.leftPct).toBeCloseTo(80, 5); // 50 + cos(0)*60*0.5 = 80
    expect(p.topPct).toBeCloseTo(50, 5); // 50 + sin(0)*60*0.5 = 50
  });
  it('places 90° contact directly south of centre', () => {
    const p = RadarMathService.contactPosition(90, 60);
    expect(p.leftPct).toBeCloseTo(50, 5);
    expect(p.topPct).toBeCloseTo(80, 5);
  });
  it('places 180° contact directly west', () => {
    const p = RadarMathService.contactPosition(180, 50);
    expect(p.leftPct).toBeCloseTo(25, 5); // 50 + cos(π)*50*0.5 = 50 - 25
    expect(p.topPct).toBeCloseTo(50, 5);
  });
  it('keeps a zero-distance contact at the centre', () => {
    const p = RadarMathService.contactPosition(45, 0);
    expect(p.leftPct).toBeCloseTo(50, 5);
    expect(p.topPct).toBeCloseTo(50, 5);
  });
});
