// Pure helpers for the PageSpeed Insights gauge animation. The component
// owns the rAF loop and `ref()`s; the maths lives here.

const RADIUS = 42;
const STROKE = 8;
const CIRC = 2 * Math.PI * RADIUS;
const DURATION_MS = 1700;
const DESKTOP_DELAY_MS = 250;

export class PageSpeedAnimService {
  static readonly RADIUS = RADIUS;
  static readonly STROKE = STROKE;
  static readonly CIRC = CIRC;

  /** Cubic ease-out: same curve PageSpeed Insights uses for its dial reveal. */
  static easeOut(p: number): number {
    return 1 - Math.pow(1 - p, 3);
  }

  /** Score progress 0–1 for the mobile gauge given elapsed time since start. */
  static mobileProgress(elapsedMs: number): number {
    return Math.min(1, elapsedMs / DURATION_MS);
  }

  /**
   * Score progress 0–1 for the desktop gauge — kicks in 250ms after mobile
   * for a staggered reveal effect.
   */
  static desktopProgress(elapsedMs: number): number {
    return Math.max(0, Math.min(1, (elapsedMs - DESKTOP_DELAY_MS) / DURATION_MS));
  }

  /** Score (0–100) at a given progress. */
  static scoreAt(progress: number): number {
    return Math.round(PageSpeedAnimService.easeOut(progress) * 100);
  }

  /** SVG `stroke-dashoffset` for a circle with radius RADIUS at given score. */
  static dashOffset(score: number): number {
    return CIRC * (1 - score / 100);
  }

  /** Bucket score into PageSpeed's stoplight palette. */
  static scoreColor(score: number): string {
    if (score >= 90) return '#0cce6b';
    if (score >= 50) return '#ffa400';
    return '#ff4e42';
  }

  /** True when both gauges have animated to completion. */
  static isComplete(elapsedMs: number): boolean {
    return PageSpeedAnimService.mobileProgress(elapsedMs) >= 1
      && PageSpeedAnimService.desktopProgress(elapsedMs) >= 1;
  }
}
