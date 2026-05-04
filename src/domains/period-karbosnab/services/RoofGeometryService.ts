import { FormatService } from '@/shared/utils/format';
import type {
  Edge,
  Face,
  Material,
  RoofDimensions,
  RoofGeo,
  RoofKind,
} from '../interface/RoofTypes';

// View-port for the inline SVG that renders the roof. The component sets the
// same viewBox so it sees identical coordinates.
export const VIEW_W = 520;
export const VIEW_H = 320;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2 + 28;

// Dimension limits (mm) used by the +/− steppers. Slope (a1/a2) is the height
// of the canopy, length (d1/d2) is along the building. Step is the click delta.
export const ROOF_LIMITS = Object.freeze({
  slopeMin: 500,
  slopeMax: 10_000,
  lengthMin: 1000,
  lengthMax: 20_000,
  step: 100,
});

// Animation tuning — extracted so the component is pure layout/state.
const SMOOTH_FACTOR = 0.18;        // lerp factor per frame (~6 frames to converge)
const OSC_PERIOD_MS = 1900;        // ~5.5 s full sine cycle
const OSC_AMPLITUDE = 0.22;        // ±0.22 rad ≈ ±13°

// Pricing & options approximate the real karbosnab.com widget for demo purposes.
export const MATERIALS: readonly Material[] = Object.freeze([
  {
    key: 'monolithic',
    pricePerM2: 1075,
    colorOptions: ['transparent', 'bronze', 'opal'],
    sizeOptions: ['2 mm', '4 mm', '6 mm', '8 mm'],
    defaultColor: 'transparent',
    defaultSize: '2 mm',
  },
  {
    key: 'profiled',
    pricePerM2: 990,
    colorOptions: ['transparent', 'bronze'],
    sizeOptions: ['0.8 mm', '1.0 mm', '1.2 mm'],
    defaultColor: 'transparent',
    defaultSize: '0.8 mm',
  },
  {
    key: 'honeycomb',
    pricePerM2: 698,
    colorOptions: ['graphite', 'transparent', 'bronze', 'opal'],
    sizeOptions: ['STANDARD', 'PREMIUM'],
    defaultColor: 'graphite',
    defaultSize: 'PREMIUM',
  },
]);

interface ColorTint {
  light: string;
  mid: string;
  dark: string;
}

const COLOR_HEX: Readonly<Record<string, ColorTint>> = Object.freeze({
  transparent: { light: '#cdedee', mid: '#6cd4d6', dark: '#1f7a7c' },
  прозорий: { light: '#cdedee', mid: '#6cd4d6', dark: '#1f7a7c' },
  bronze: { light: '#e8c285', mid: '#b8814a', dark: '#754d24' },
  бронза: { light: '#e8c285', mid: '#b8814a', dark: '#754d24' },
  opal: { light: '#f5f0e2', mid: '#d8d0bf', dark: '#9a9486' },
  опал: { light: '#f5f0e2', mid: '#d8d0bf', dark: '#9a9486' },
  graphite: { light: '#65656e', mid: '#3a3a42', dark: '#1c1c22' },
  графіт: { light: '#65656e', mid: '#3a3a42', dark: '#1c1c22' },
});

export class RoofGeometryService {
  /**
   * Clamp a single dimension after a +/− step. Slope dims (a1/a2) and
   * length dims (d1/d2) have different ranges — pass `'slope'` or
   * `'length'` so the component never has to know the limits inline.
   */
  static stepDimension(value: number, delta: number, axis: 'slope' | 'length'): number {
    const min = axis === 'slope' ? ROOF_LIMITS.slopeMin : ROOF_LIMITS.lengthMin;
    const max = axis === 'slope' ? ROOF_LIMITS.slopeMax : ROOF_LIMITS.lengthMax;
    return Math.max(min, Math.min(max, value + delta));
  }

  /** Linear interpolation step used to smooth dimension changes per frame. */
  static lerp(current: number, target: number, factor = SMOOTH_FACTOR): number {
    return current + (target - current) * factor;
  }

  /** Slow sine-wave Y-axis rotation in radians for the gentle turntable feel. */
  static oscillationRad(elapsedMs: number): number {
    return Math.sin(elapsedMs / OSC_PERIOD_MS) * OSC_AMPLITUDE;
  }

  /** Square-metre area for a given roof kind + dimensions. */
  static areaM2(kind: RoofKind, dims: RoofDimensions): number {
    const a1m = dims.a1 / 1000;
    const d1m = dims.d1 / 1000;
    if (kind === 'arched') {
      // arched: arc length ≈ slope × π/2 (half-circle approximation)
      return Math.round(a1m * d1m * 1.4 * 100) / 100;
    }
    if (kind === 'double') {
      const a2m = dims.a2 / 1000;
      const d2m = dims.d2 / 1000;
      return Math.round((a1m * d1m + a2m * d2m) * 100) / 100;
    }
    return Math.round(a1m * d1m * 100) / 100;
  }

  /** Price for one material at a given area, rounded to 2dp. */
  static priceFor(material: Material, areaM2: number): number {
    return Math.round(areaM2 * material.pricePerM2 * 100) / 100;
  }

  static formatPrice(value: number): string {
    return FormatService.currency2dp(value);
  }

  /** Inline-style for the material thumbnail (cyan / bronze / opal / graphite). */
  static thumbStyle(material: Material, color: string): Record<string, string> {
    const tint = COLOR_HEX[color] ?? COLOR_HEX.transparent;
    if (material.key === 'monolithic') {
      return {
        background: `linear-gradient(135deg, ${tint.light}, ${tint.mid} 45%, ${tint.dark})`,
        backgroundImage:
          'linear-gradient(180deg, transparent 30%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.4) 35%, transparent 35%, transparent 60%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.3) 64%, transparent 64%),' +
          `linear-gradient(135deg, ${tint.light}, ${tint.mid} 45%, ${tint.dark})`,
      };
    }
    if (material.key === 'profiled') {
      return {
        background: `repeating-linear-gradient(90deg, ${tint.mid} 0 4px, ${tint.dark} 4px 8px)`,
      };
    }
    return {
      // honeycomb — vertical tubes
      background: `repeating-linear-gradient(0deg, ${tint.dark} 0 4px, ${tint.mid} 4px 8px)`,
    };
  }

  /**
   * Iso projection with Y-axis rotation around (cx3d, cz3d) pivot.
   * 3D coords: x = length axis, y = vertical, z = slope axis.
   */
  static isoR(
    x: number, y: number, z: number,
    cx3d: number, cz3d: number,
    scale: number, rot: number,
  ): [number, number] {
    const dx = x - cx3d;
    const dz = z - cz3d;
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    const xR = dx * c + dz * s;
    const zR = -dx * s + dz * c;
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);
    return [
      CX + (xR - zR) * cos30 * scale,
      CY + (xR + zR) * sin30 * scale - y * scale,
    ];
  }

  /** Build the SVG-ready roof geometry for the active kind and dimensions. */
  static build(kind: RoofKind, dims: RoofDimensions, rot: number): RoofGeo {
    const { a1: A1, d1: D1, a2: A2, d2: D2 } = dims;
    const totalDepth = kind === 'double' ? Math.max(D1, D2) : D1;
    const totalSlope = kind === 'double' ? A1 + A2 : A1;
    const maxDim = Math.max(totalDepth, totalSlope, 1);
    const scale = 170 / maxDim;
    const cx3d = totalDepth / 2;
    const cz3d = totalSlope / 2;

    const project = (x: number, y: number, z: number): [number, number] =>
      RoofGeometryService.isoR(x, y, z, cx3d, cz3d, scale, rot);

    const c = Math.cos(rot);
    const s = Math.sin(rot);
    const projDepth = (cx: number, cz: number): number => {
      const dx = cx - cx3d;
      const dz = cz - cz3d;
      return (dx * c + dz * s) + (-dx * s + dz * c);
    };

    const pt = (p: [number, number]): string => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

    if (kind === 'single') {
      return RoofGeometryService.buildSingle(A1, D1, project, projDepth, pt);
    }
    if (kind === 'double') {
      return RoofGeometryService.buildDouble(A1, A2, D1, D2, project, projDepth, pt);
    }
    return RoofGeometryService.buildArched(A1, D1, project, projDepth, pt);
  }

  private static buildSingle(
    A1: number, D1: number,
    P: (x: number, y: number, z: number) => [number, number],
    projDepth: (cx: number, cz: number) => number,
    pt: (p: [number, number]) => string,
  ): RoofGeo {
    const ridgeH = A1 * 0.55;
    const A = P(0, 0, 0);
    const B = P(D1, 0, 0);
    const C = P(D1, ridgeH, 0);
    const D = P(0, ridgeH, 0);
    const E = P(D1, 0, A1);
    const F = P(0, 0, A1);

    const faces: Face[] = [
      { points: `${pt(A)} ${pt(B)} ${pt(E)} ${pt(F)}`, tone: 'bottom', depth: -1000 },
      { points: `${pt(A)} ${pt(B)} ${pt(C)} ${pt(D)}`, tone: 'side', depth: projDepth(D1 / 2, 0) },
      { points: `${pt(A)} ${pt(D)} ${pt(F)}`, tone: 'side', depth: projDepth(0, A1 / 2) },
      { points: `${pt(B)} ${pt(C)} ${pt(E)}`, tone: 'side', depth: projDepth(D1, A1 / 2) },
      { points: `${pt(D)} ${pt(C)} ${pt(E)} ${pt(F)}`, tone: 'top', depth: projDepth(D1 / 2, A1 / 2) + 1000 },
    ];
    faces.sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0));

    const edges: Edge[] = [
      { x1: D[0], y1: D[1], x2: C[0], y2: C[1], color: 'length1' },
      { x1: F[0], y1: F[1], x2: E[0], y2: E[1], color: 'length1' },
      { x1: D[0], y1: D[1], x2: F[0], y2: F[1], color: 'slope1' },
      { x1: C[0], y1: C[1], x2: E[0], y2: E[1], color: 'slope1' },
    ];
    return { faces, edges, archPath: null, archFrontPolyline: null, archBackPolyline: null };
  }

  private static buildDouble(
    A1: number, A2: number, D1: number, D2: number,
    P: (x: number, y: number, z: number) => [number, number],
    projDepth: (cx: number, cz: number) => number,
    pt: (p: [number, number]) => string,
  ): RoofGeo {
    const ridgeH = Math.max(A1, A2) * 0.6;
    const W = A1 + A2;
    const Dmax = Math.max(D1, D2);

    const flA = P(0, 0, 0);
    const frA = P(Dmax, 0, 0);
    const brA = P(Dmax, 0, W);
    const blA = P(0, 0, W);
    const pkL = P(0, ridgeH, A1);
    const pkR = P(Dmax, ridgeH, A1);

    const lFE = P(0, 0, 0);
    const lBE = P(D1, 0, 0);
    const lBR = P(D1, ridgeH, A1);
    const lFR = P(0, ridgeH, A1);
    const rFR = P(0, ridgeH, A1);
    const rBR = P(D2, ridgeH, A1);
    const rBE = P(D2, 0, W);
    const rFE = P(0, 0, W);

    const faces: Face[] = [
      { points: `${pt(flA)} ${pt(frA)} ${pt(brA)} ${pt(blA)}`, tone: 'bottom', depth: -1000 },
      { points: `${pt(flA)} ${pt(blA)} ${pt(pkL)}`, tone: 'side', depth: projDepth(0, W / 2) },
      { points: `${pt(frA)} ${pt(brA)} ${pt(pkR)}`, tone: 'side', depth: projDepth(Dmax, W / 2) },
      { points: `${pt(lFE)} ${pt(lBE)} ${pt(lBR)} ${pt(lFR)}`, tone: 'top', depth: projDepth(D1 / 2, A1 / 2) + 1000 },
      { points: `${pt(rFR)} ${pt(rBR)} ${pt(rBE)} ${pt(rFE)}`, tone: 'top', depth: projDepth(D2 / 2, A1 + A2 / 2) + 1000 },
    ];
    faces.sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0));

    const edges: Edge[] = [
      { x1: lFE[0], y1: lFE[1], x2: lBE[0], y2: lBE[1], color: 'length1' },
      { x1: rFE[0], y1: rFE[1], x2: rBE[0], y2: rBE[1], color: 'length2' },
      { x1: lFE[0], y1: lFE[1], x2: lFR[0], y2: lFR[1], color: 'slope1' },
      { x1: lBE[0], y1: lBE[1], x2: lBR[0], y2: lBR[1], color: 'slope1' },
      { x1: rFR[0], y1: rFR[1], x2: rFE[0], y2: rFE[1], color: 'slope2' },
      { x1: rBR[0], y1: rBR[1], x2: rBE[0], y2: rBE[1], color: 'slope2' },
    ];
    return { faces, edges, archPath: null, archFrontPolyline: null, archBackPolyline: null };
  }

  private static buildArched(
    A1: number, D1: number,
    P: (x: number, y: number, z: number) => [number, number],
    projDepth: (cx: number, cz: number) => number,
    pt: (p: [number, number]) => string,
  ): RoofGeo {
    const archHeight = A1 * 0.55;
    const segments = 24;
    const frontPts: [number, number][] = [];
    const backPts: [number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = Math.PI * (1 - t);
      const z = A1 / 2 + Math.cos(angle) * (A1 / 2);
      const y = Math.sin(angle) * archHeight;
      frontPts.push(P(0, y, z));
      backPts.push(P(D1, y, z));
    }

    const flA = P(0, 0, 0);
    const frA = P(D1, 0, 0);
    const brA = P(D1, 0, A1);
    const blA = P(0, 0, A1);

    const frontWallPoly = frontPts.map(pt).join(' ');
    const backWallPoly = backPts.map(pt).join(' ');

    const archPath =
      'M ' + pt(frontPts[0]) +
      frontPts.slice(1).map((p) => ' L ' + pt(p)).join('') +
      ' L ' + pt(backPts[backPts.length - 1]) +
      [...backPts].reverse().slice(1).map((p) => ' L ' + pt(p)).join('') +
      ' Z';

    const faces: Face[] = [
      { points: `${pt(flA)} ${pt(frA)} ${pt(brA)} ${pt(blA)}`, tone: 'bottom', depth: -1000 },
      { points: frontWallPoly, tone: 'side', depth: projDepth(0, A1 / 2) },
      { points: backWallPoly, tone: 'side', depth: projDepth(D1, A1 / 2) },
    ];
    faces.sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0));

    const edges: Edge[] = [
      { x1: frontPts[0][0], y1: frontPts[0][1], x2: backPts[0][0], y2: backPts[0][1], color: 'length1' },
      { x1: frontPts[segments][0], y1: frontPts[segments][1], x2: backPts[segments][0], y2: backPts[segments][1], color: 'length1' },
    ];
    return {
      faces,
      edges,
      archPath,
      archFrontPolyline: frontPts.map(pt).join(' '),
      archBackPolyline: backPts.map(pt).join(' '),
    };
  }
}
