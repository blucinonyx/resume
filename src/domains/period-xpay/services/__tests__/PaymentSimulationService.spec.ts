import { describe, expect, it } from 'vitest';
import { PaymentSimulationService } from '../PaymentSimulationService';

describe('PaymentSimulationService.randAmount', () => {
  it('returns a positive integer within the documented bands', () => {
    for (let i = 0; i < 200; i++) {
      const a = PaymentSimulationService.randAmount();
      expect(Number.isInteger(a)).toBe(true);
      expect(a).toBeGreaterThan(0);
      expect(a).toBeLessThan(11_000); // upper band is ~10000
    }
  });
});

describe('PaymentSimulationService.randCard', () => {
  it('produces a 4-digit numeric string', () => {
    for (let i = 0; i < 50; i++) {
      const c = PaymentSimulationService.randCard();
      expect(c).toMatch(/^\d{4}$/);
    }
  });
});

describe('PaymentSimulationService.randTxn', () => {
  it('uses the txn_ prefix and base36 tail', () => {
    const t = PaymentSimulationService.randTxn();
    expect(t).toMatch(/^txn_[0-9a-z]{1,8}$/);
  });
});

describe('PaymentSimulationService.randBrand', () => {
  it('returns one of the documented card brands', () => {
    for (let i = 0; i < 50; i++) {
      const b = PaymentSimulationService.randBrand();
      expect(['visa', 'mc']).toContain(b);
    }
  });
});

describe('PaymentSimulationService.nowStamp', () => {
  it('matches HH:MM:SS.mmm shape', () => {
    expect(PaymentSimulationService.nowStamp()).toMatch(/^\d{2}:\d{2}:\d{2}\.\d{3}$/);
  });
});

describe('PaymentSimulationService.decorativeLatencyMs', () => {
  it('stays in a sensible band', () => {
    for (let i = 0; i < 20; i++) {
      const ms = PaymentSimulationService.decorativeLatencyMs();
      expect(ms).toBeGreaterThanOrEqual(220);
      expect(ms).toBeLessThanOrEqual(340);
    }
  });
});
