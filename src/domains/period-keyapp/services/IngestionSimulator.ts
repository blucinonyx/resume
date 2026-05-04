// Pure-TS class that produces "ingestion" tick data.
// Lives outside Vue/Pinia so it stays unit-testable; used both inline and (later) in a Web Worker.

import type { SimTick, SimConfig } from '../interface/SimTypes';
export type { SimTick, SimConfig };

export const DEFAULT_CONFIG: SimConfig = Object.freeze({
  tickIntervalMs: 250,
  targetEventsPerSec: 14_221,
  rampSeconds: 18,
  startingTotal: 87_342_000,
});

export class IngestionSimulator {
  private ticksElapsed = 0;
  private totalToday: number;
  private readonly cfg: SimConfig;

  constructor(config: Partial<SimConfig> = {}) {
    this.cfg = { ...DEFAULT_CONFIG, ...config };
    this.totalToday = this.cfg.startingTotal;
  }

  next(): SimTick {
    this.ticksElapsed += 1;
    const sec = (this.ticksElapsed * this.cfg.tickIntervalMs) / 1000;
    const ramp = Math.min(1, sec / this.cfg.rampSeconds);
    const noise = 0.85 + Math.random() * 0.3;
    const eventsPerSec = Math.round(this.cfg.targetEventsPerSec * ramp * noise);
    const eventsThisTick = Math.round((eventsPerSec * this.cfg.tickIntervalMs) / 1000);
    this.totalToday += eventsThisTick;

    const bufferDepth = Math.round(8_000 + Math.random() * 6_000 * ramp);
    const p99 = Math.round(18 + Math.random() * 14);
    const backpressurePct = Math.round((Math.random() * 0.8 + 0.1) * 10) / 10;

    return {
      t: sec,
      eventsPerSec,
      totalToday: this.totalToday,
      bufferDepth,
      p99,
      backpressurePct,
    };
  }

  reset(): void {
    this.ticksElapsed = 0;
    this.totalToday = this.cfg.startingTotal;
  }

  /**
   * Pure helper for the sparkline strip: pads `values` to `count` slots,
   * scales them into the [`minPct`, 100] range so flat samples still draw
   * a visible bar. Used by PipelineSimulator's <template>.
   */
  static barHeights(values: readonly number[], count = 24, minPct = 25): number[] {
    if (values.length === 0) {
      return Array.from({ length: count }, () => minPct);
    }
    const max = Math.max(...values, 1);
    const padded = [
      ...Array(Math.max(0, count - values.length)).fill(0),
      ...values,
    ];
    return padded.slice(-count).map((v) => minPct + (v / max) * (100 - minPct));
  }
}
