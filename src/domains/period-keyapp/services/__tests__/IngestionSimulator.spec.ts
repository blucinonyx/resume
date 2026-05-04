import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, IngestionSimulator } from '../IngestionSimulator';

describe('IngestionSimulator.next', () => {
  it('returns a tick with all expected numeric fields', () => {
    const sim = new IngestionSimulator();
    const tick = sim.next();
    expect(typeof tick.t).toBe('number');
    expect(typeof tick.eventsPerSec).toBe('number');
    expect(typeof tick.totalToday).toBe('number');
    expect(typeof tick.bufferDepth).toBe('number');
    expect(typeof tick.p99).toBe('number');
    expect(typeof tick.backpressurePct).toBe('number');
  });

  it('starts at the configured starting total', () => {
    const sim = new IngestionSimulator({ startingTotal: 1_000_000 });
    const tick = sim.next();
    expect(tick.totalToday).toBeGreaterThanOrEqual(1_000_000);
  });

  it('events-per-sec ramps up but never exceeds noise-adjusted target', () => {
    const sim = new IngestionSimulator();
    // target * max-noise = target * 1.15
    const cap = DEFAULT_CONFIG.targetEventsPerSec * 1.16;
    for (let i = 0; i < 200; i++) {
      const t = sim.next();
      expect(t.eventsPerSec).toBeLessThan(cap);
    }
  });
});

describe('IngestionSimulator.reset', () => {
  it('rewinds totalToday to the starting baseline', () => {
    const sim = new IngestionSimulator({ startingTotal: 100 });
    sim.next();
    sim.next();
    sim.reset();
    const after = sim.next();
    expect(after.totalToday).toBeGreaterThanOrEqual(100);
    expect(after.totalToday).toBeLessThan(200_000); // not still climbing
  });
});
