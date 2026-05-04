import type { Blip } from '../interface/RadarTypes';

// Pure trigonometry helpers for the marine radar visual.
// Lives in services/ so the .vue template stays declarative — no inline
// `Math.cos(...)` in interpolation.

const SWEEP_PERIOD_DIVISOR = 30;   // tighter divisor → faster spin
const BLIP_LIFETIME_MS = 4000;
const SPAWN_PROB = 0.012;
const HEADING_BASE_DEG = 180;
const HEADING_AMPLITUDE = 40;

export interface RadarPoint {
  /** Percentage, 0–100, suitable for `left:` */
  leftPct: number;
  /** Percentage, 0–100, suitable for `top:` */
  topPct: number;
}

export interface RadarTickResult {
  sweepDeg: number;
  blips: Blip[];
}

export class RadarMathService {
  /** Sweep angle (degrees) at the given elapsed time since the radar started. */
  static sweepAngle(elapsedMs: number): number {
    return (elapsedMs / SWEEP_PERIOD_DIVISOR) % 360;
  }

  /**
   * Advance the radar one rAF tick — possibly spawn a new blip, drop
   * everything older than the fade-out window. Returns the new sweep
   * angle and blip list (component just assigns them to refs).
   */
  static tick(
    blips: readonly Blip[],
    elapsedMs: number,
    now: number,
    nextId: () => number,
  ): RadarTickResult {
    let next: Blip[] = [...blips];
    if (Math.random() < SPAWN_PROB) {
      next = [
        ...next,
        {
          id: nextId(),
          angle: Math.random() * 360,
          distance: 30 + Math.random() * 60,
          bornAt: now,
        },
      ];
    }
    next = next.filter((b) => now - b.bornAt < BLIP_LIFETIME_MS);
    return { sweepDeg: RadarMathService.sweepAngle(elapsedMs), blips: next };
  }

  /** Decorative heading reading driven off the sweep angle. */
  static headingFromSweep(sweepDeg: number): number {
    return Math.round(HEADING_BASE_DEG + Math.sin(sweepDeg / 60) * HEADING_AMPLITUDE);
  }

  /** Decorative sea-state reading (1–4) driven off the sweep angle. */
  static seaStateFromSweep(sweepDeg: number): number {
    return 2 + Math.round(Math.abs(Math.sin(sweepDeg / 90)) * 2);
  }

  /**
   * Convert a polar contact (angle in degrees, distance 0–100% radius)
   * into top/left percentages for absolute positioning inside the round
   * scope. 0° points right (east), increasing clockwise per the radar
   * sweep convention used in NavyRadar.vue.
   */
  static contactPosition(angleDeg: number, distancePct: number): RadarPoint {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      leftPct: 50 + Math.cos(rad) * distancePct * 0.5,
      topPct: 50 + Math.sin(rad) * distancePct * 0.5,
    };
  }
}
