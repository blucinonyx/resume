<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';

type RoofKind = 'arched' | 'single' | 'double';

interface Material {
  key: 'monolithic' | 'profiled' | 'honeycomb';
  pricePerM2: number; // ₴
  colorOptions: string[];
  sizeOptions: string[];
  defaultColor: string;
  defaultSize: string;
}

interface Selection {
  color: string;
  size: string;
}

const i18n = useI18nStore();

// Pricing & options approximate the real karbosnab.com widget for demo purposes.
const MATERIALS_EN: Material[] = [
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
];

const labels = {
  [Lang.EN]: {
    title: 'Roof calculation',
    kinds: { arched: 'Arched canopy', single: 'Single-slope', double: 'Double-slope' },
    sectionLeft: 'Individual calculation',
    sectionRight: 'Implementation variants',
    sizesLbl: 'Dimensions:',
    slope: 'Slope',
    length: 'Length',
    calc: 'Calculate',
    materials: {
      monolithic: 'Monolithic polycarbonate',
      profiled: 'Profiled polycarbonate',
      honeycomb: 'Cellular polycarbonate',
    },
    color: 'colour',
    size: 'option',
    mm: 'mm',
    currency: 'UAH',
  },
  [Lang.UK]: {
    title: 'Розрахунок покрівлі',
    kinds: { arched: 'Арочний навіс', single: 'Односкатний навіс', double: 'Двоскатний навіс' },
    sectionLeft: 'Індивідуальний прорахунок',
    sectionRight: 'Варіанти реалізації',
    sizesLbl: 'Розміри:',
    slope: 'Скат',
    length: 'Довжина',
    calc: 'Розрахувати',
    materials: {
      monolithic: 'Монолітний полікарбонат',
      profiled: 'Профільований полікарбонат',
      honeycomb: 'Сотовий полікарбонат',
    },
    color: 'колір',
    size: 'опція',
    mm: 'мм',
    currency: 'грн',
  },
} as const;
const t = computed(() => labels[i18n.current]);

const kind = ref<RoofKind>('single');
const a1 = ref(4000);
const d1 = ref(6000);
const a2 = ref(4000);
const d2 = ref(6000);

const A_MIN = 500;
const A_MAX = 10_000;
const D_MIN = 1000;
const D_MAX = 20_000;
const STEP = 100;

function step(target: 'a1' | 'd1' | 'a2' | 'd2', delta: number): void {
  const isA = target === 'a1' || target === 'a2';
  const min = isA ? A_MIN : D_MIN;
  const max = isA ? A_MAX : D_MAX;
  const refMap = { a1, d1, a2, d2 };
  const r = refMap[target];
  r.value = Math.max(min, Math.min(max, r.value + delta));
}

const selections = ref<Record<Material['key'], Selection>>({
  monolithic: { color: 'transparent', size: '2 mm' },
  profiled: { color: 'transparent', size: '0.8 mm' },
  honeycomb: { color: 'graphite', size: 'PREMIUM' },
});

// area in m² depending on roof kind
const areaM2 = computed(() => {
  const a1m = a1.value / 1000;
  const d1m = d1.value / 1000;
  if (kind.value === 'arched') {
    // arched: arc length ≈ slope × π/2 (half-circle approximation)
    return Math.round(a1m * d1m * 1.4 * 100) / 100;
  }
  if (kind.value === 'double') {
    const a2m = a2.value / 1000;
    const d2m = d2.value / 1000;
    return Math.round((a1m * d1m + a2m * d2m) * 100) / 100;
  }
  return Math.round(a1m * d1m * 100) / 100;
});

function priceFor(material: Material): number {
  return Math.round(areaM2.value * material.pricePerM2 * 100) / 100;
}

function fmtPrice(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Live thumbnails — colour shifts to whatever option the user picks.
const COLOR_HEX: Record<string, { light: string; mid: string; dark: string }> = {
  transparent: { light: '#cdedee', mid: '#6cd4d6', dark: '#1f7a7c' },
  прозорий: { light: '#cdedee', mid: '#6cd4d6', dark: '#1f7a7c' },
  bronze: { light: '#e8c285', mid: '#b8814a', dark: '#754d24' },
  бронза: { light: '#e8c285', mid: '#b8814a', dark: '#754d24' },
  opal: { light: '#f5f0e2', mid: '#d8d0bf', dark: '#9a9486' },
  опал: { light: '#f5f0e2', mid: '#d8d0bf', dark: '#9a9486' },
  graphite: { light: '#65656e', mid: '#3a3a42', dark: '#1c1c22' },
  графіт: { light: '#65656e', mid: '#3a3a42', dark: '#1c1c22' },
};

function thumbStyle(material: Material, color: string): Record<string, string> {
  const tint = COLOR_HEX[color] ?? COLOR_HEX.transparent;
  if (material.key === 'monolithic') {
    return {
      background: `linear-gradient(135deg, ${tint.light}, ${tint.mid} 45%, ${tint.dark})`,
      backgroundImage: `
        linear-gradient(180deg, transparent 30%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.4) 35%, transparent 35%, transparent 60%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.3) 64%, transparent 64%),
        linear-gradient(135deg, ${tint.light}, ${tint.mid} 45%, ${tint.dark})
      `,
    };
  }
  if (material.key === 'profiled') {
    return {
      background: `repeating-linear-gradient(90deg, ${tint.mid} 0 4px, ${tint.dark} 4px 8px)`,
    };
  }
  // honeycomb — vertical tubes
  return {
    background: `repeating-linear-gradient(0deg, ${tint.dark} 0 4px, ${tint.mid} 4px 8px)`,
  };
}

// ── 3D roof rendering via inline SVG with isometric projection ────────────
// Geometry recomputes each frame from smoothed dimensions + slow Y-axis rotation.

type EdgeColor = 'slope1' | 'length1' | 'slope2' | 'length2';
interface Edge { x1: number; y1: number; x2: number; y2: number; color: EdgeColor; }
interface Face { points: string; depth?: number; tone?: 'top' | 'side' | 'bottom'; }
interface RoofGeo {
  faces: Face[];
  edges: Edge[];
  archPath: string | null;
  archFrontPolyline: string | null;
  archBackPolyline: string | null;
}

const VIEW_W = 520;
const VIEW_H = 320;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2 + 28;

// Smoothed (animated) dimensions and rotation angle. The raw `a1/d1/a2/d2`
// refs are bound to the inputs; the *Sm refs lerp toward them so a click on
// +/- visibly redraws the figure rather than snapping.
const a1Sm = ref(a1.value);
const d1Sm = ref(d1.value);
const a2Sm = ref(a2.value);
const d2Sm = ref(d2.value);
const aRot = ref(0); // radians, gentle Y-axis oscillation
const highlightedEdge = ref<EdgeColor | null>(null);

let raf = 0;
const startTime = performance.now();
function tick(now: number): void {
  // Gentle ±0.22 rad (~13°) oscillation, ~5.5 s period — slow turntable feel
  // without disorienting the geometry.
  aRot.value = Math.sin((now - startTime) / 1900) * 0.22;
  // Lerp smoothed values toward targets (~6 frames to converge for 0.18).
  const k = 0.18;
  a1Sm.value += (a1.value - a1Sm.value) * k;
  d1Sm.value += (d1.value - d1Sm.value) * k;
  a2Sm.value += (a2.value - a2Sm.value) * k;
  d2Sm.value += (d2.value - d2Sm.value) * k;
  raf = requestAnimationFrame(tick);
}
onMounted(() => { raf = requestAnimationFrame(tick); });
onBeforeUnmount(() => cancelAnimationFrame(raf));

// Iso projection with Y-axis rotation around (cx3d, cz3d) pivot.
// 3D coords: x = length axis, y = vertical, z = slope axis.
function isoR(
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

function pt(p: [number, number]): string {
  return `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
}

const roofGeometry = computed<RoofGeo>(() => {
  const A1 = a1Sm.value;
  const D1 = d1Sm.value;
  const A2 = a2Sm.value;
  const D2 = d2Sm.value;
  const rot = aRot.value;
  const totalDepth = kind.value === 'double' ? Math.max(D1, D2) : D1;
  const totalSlope = kind.value === 'double' ? A1 + A2 : A1;
  const maxDim = Math.max(totalDepth, totalSlope, 1);
  const scale = 170 / maxDim;

  // Pivot at the centre of the roof footprint so it spins on its own axis.
  const cx3d = totalDepth / 2;
  const cz3d = totalSlope / 2;
  const P = (x: number, y: number, z: number): [number, number] =>
    isoR(x, y, z, cx3d, cz3d, scale, rot);

  if (kind.value === 'single') {
    // Right-triangular wedge (lean-to canopy section). Profile from the side
    // is a scalene right triangle: vertical back wall + horizontal floor +
    // slanted hypotenuse roof. Reads unmistakably as a 3D building section.
    const ridgeH = A1 * 0.55; // back wall height
    // 6 vertices.
    const A = P(0, 0, 0);          // back-bottom-left
    const B = P(D1, 0, 0);         // back-bottom-right
    const C = P(D1, ridgeH, 0);    // back-TOP-right
    const D = P(0, ridgeH, 0);     // back-TOP-left
    const E = P(D1, 0, A1);        // front-bottom-right
    const F = P(0, 0, A1);         // front-bottom-left

    // Painter's depth — average y-into-iso. Bigger = closer to camera, drawn
    // later. We use the same 3D centroid-projection trick as for double-slope.
    const c = Math.cos(rot), s = Math.sin(rot);
    const projDepth = (cx: number, cz: number): number => {
      const dx = cx - cx3d;
      const dz = cz - cz3d;
      return (dx * c + dz * s) + (-dx * s + dz * c);
    };

    const wedgeFaces: Face[] = [
      // Floor (always backdrop)
      { points: `${pt(A)} ${pt(B)} ${pt(E)} ${pt(F)}`, tone: 'bottom', depth: -1000 },
      // Back wall (rectangle, vertical)
      { points: `${pt(A)} ${pt(B)} ${pt(C)} ${pt(D)}`, tone: 'side', depth: projDepth(D1 / 2, 0) },
      // Left side (triangle)
      { points: `${pt(A)} ${pt(D)} ${pt(F)}`, tone: 'side', depth: projDepth(0, A1 / 2) },
      // Right side (triangle)
      { points: `${pt(B)} ${pt(C)} ${pt(E)}`, tone: 'side', depth: projDepth(D1, A1 / 2) },
      // Slanted top (the polycarbonate roof itself — parallelogram)
      {
        points: `${pt(D)} ${pt(C)} ${pt(E)} ${pt(F)}`,
        tone: 'top',
        depth: projDepth(D1 / 2, A1 / 2) + 1000,
      },
    ];
    wedgeFaces.sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0));
    return {
      faces: wedgeFaces,
      edges: [
        // Length edges (D1, blue) — back ridge (D-C) and front eave (F-E)
        { x1: D[0], y1: D[1], x2: C[0], y2: C[1], color: 'length1' },
        { x1: F[0], y1: F[1], x2: E[0], y2: E[1], color: 'length1' },
        // Slope edges (A1, green) — left rake (D-F) and right rake (C-E)
        { x1: D[0], y1: D[1], x2: F[0], y2: F[1], color: 'slope1' },
        { x1: C[0], y1: C[1], x2: E[0], y2: E[1], color: 'slope1' },
      ],
      archPath: null,
      archFrontPolyline: null,
      archBackPolyline: null,
    };
  }

  if (kind.value === 'double') {
    // Double-slope canopy: floor rectangle + two triangular end walls (at x=0
    // and x=D1) with the ridge peak above z=A1, plus two slanted top faces
    // meeting at the ridge. Reads as a tent / pitched-roof building section.
    const ridgeH = Math.max(A1, A2) * 0.6;
    // Footprint is on the ground (y=0). Width = A1 + A2 along z.
    const W = A1 + A2;
    // Use largest D for the floor / peak length so D1 ≠ D2 still draws.
    const Dmax = Math.max(D1, D2);

    // Floor corners
    const flA = P(0, 0, 0);          // floor front-left
    const frA = P(Dmax, 0, 0);       // floor front-right
    const brA = P(Dmax, 0, W);       // floor back-right
    const blA = P(0, 0, W);          // floor back-left
    // Peak ridge (along x axis at z=A1)
    const pkL = P(0, ridgeH, A1);    // peak-left (above x=0)
    const pkR = P(Dmax, ridgeH, A1); // peak-right (above x=Dmax)

    // Slanted top corners — left face uses D1 length, right uses D2.
    // Left slope: from front eave (z=0, y=0) up to peak (z=A1, y=ridgeH).
    const lFE = P(0, 0, 0);
    const lBE = P(D1, 0, 0);
    const lBR = P(D1, ridgeH, A1);
    const lFR = P(0, ridgeH, A1);
    // Right slope: from peak down to back eave (z=A1+A2, y=0).
    const rFR = P(0, ridgeH, A1);
    const rBR = P(D2, ridgeH, A1);
    const rBE = P(D2, 0, W);
    const rFE = P(0, 0, W);

    const c = Math.cos(rot), s = Math.sin(rot);
    const projDepth = (cx: number, cz: number): number => {
      const dx = cx - cx3d;
      const dz = cz - cz3d;
      return (dx * c + dz * s) + (-dx * s + dz * c);
    };

    const dblFaces: Face[] = [
      // Floor
      { points: `${pt(flA)} ${pt(frA)} ${pt(brA)} ${pt(blA)}`, tone: 'bottom', depth: -1000 },
      // Left end wall (at x=0) — pentagon: ground-front, ground-back, peak
      { points: `${pt(flA)} ${pt(blA)} ${pt(pkL)}`, tone: 'side', depth: projDepth(0, W / 2) },
      // Right end wall (at x=Dmax)
      { points: `${pt(frA)} ${pt(brA)} ${pt(pkR)}`, tone: 'side', depth: projDepth(Dmax, W / 2) },
      // Left slanted slope (top)
      {
        points: `${pt(lFE)} ${pt(lBE)} ${pt(lBR)} ${pt(lFR)}`,
        tone: 'top',
        depth: projDepth(D1 / 2, A1 / 2) + 1000,
      },
      // Right slanted slope (top)
      {
        points: `${pt(rFR)} ${pt(rBR)} ${pt(rBE)} ${pt(rFE)}`,
        tone: 'top',
        depth: projDepth(D2 / 2, A1 + A2 / 2) + 1000,
      },
    ];
    dblFaces.sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0));

    return {
      faces: dblFaces,
      edges: [
        // Length edges D1 (blue) — left slope eave + ridge half
        { x1: lFE[0], y1: lFE[1], x2: lBE[0], y2: lBE[1], color: 'length1' },
        // Length edges D2 (dark blue) — right slope eave
        { x1: rFE[0], y1: rFE[1], x2: rBE[0], y2: rBE[1], color: 'length2' },
        // Slope edges A1 (green) — left rakes (front + back of left slope)
        { x1: lFE[0], y1: lFE[1], x2: lFR[0], y2: lFR[1], color: 'slope1' },
        { x1: lBE[0], y1: lBE[1], x2: lBR[0], y2: lBR[1], color: 'slope1' },
        // Slope edges A2 (orange) — right rakes
        { x1: rFR[0], y1: rFR[1], x2: rFE[0], y2: rFE[1], color: 'slope2' },
        { x1: rBR[0], y1: rBR[1], x2: rBE[0], y2: rBE[1], color: 'slope2' },
      ],
      archPath: null,
      archFrontPolyline: null,
      archBackPolyline: null,
    };
  }

  // Arched canopy — half-cylinder along D axis with semicircular end walls.
  const archHeight = A1 * 0.55;
  const segments = 24;
  const frontPts: [number, number][] = [];
  const backPts: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = Math.PI * (1 - t); // π → 0
    const z = A1 / 2 + Math.cos(angle) * (A1 / 2);
    const y = Math.sin(angle) * archHeight;
    frontPts.push(P(0, y, z));
    backPts.push(P(D1, y, z));
  }

  // Floor footprint
  const flA = P(0, 0, 0);
  const frA = P(D1, 0, 0);
  const brA = P(D1, 0, A1);
  const blA = P(0, 0, A1);

  // End-wall (semicircle) polygons
  const frontWallPoly = frontPts.map(pt).join(' ');
  const backWallPoly = backPts.map(pt).join(' ');

  // Curved top (the polycarbonate sheet) — front arc + back arc reversed
  const archPath =
    'M ' + pt(frontPts[0]) +
    frontPts.slice(1).map((p) => ' L ' + pt(p)).join('') +
    ' L ' + pt(backPts[backPts.length - 1]) +
    [...backPts].reverse().slice(1).map((p) => ' L ' + pt(p)).join('') +
    ' Z';

  const c = Math.cos(rot), s = Math.sin(rot);
  const projDepth = (cx: number, cz: number): number => {
    const dx = cx - cx3d;
    const dz = cz - cz3d;
    return (dx * c + dz * s) + (-dx * s + dz * c);
  };

  const archFaces: Face[] = [
    // Floor (rectangle on the ground)
    { points: `${pt(flA)} ${pt(frA)} ${pt(brA)} ${pt(blA)}`, tone: 'bottom', depth: -1000 },
    // Front semicircular end wall
    { points: frontWallPoly, tone: 'side', depth: projDepth(0, A1 / 2) },
    // Back semicircular end wall
    { points: backWallPoly, tone: 'side', depth: projDepth(D1, A1 / 2) },
  ];
  archFaces.sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0));

  return {
    faces: archFaces,
    edges: [
      // Eave length edges (D1, blue) — left and right ground edges along D
      { x1: frontPts[0][0], y1: frontPts[0][1], x2: backPts[0][0], y2: backPts[0][1], color: 'length1' },
      { x1: frontPts[segments][0], y1: frontPts[segments][1], x2: backPts[segments][0], y2: backPts[segments][1], color: 'length1' },
    ],
    archPath, // curved top polycarbonate, drawn last in template
    archFrontPolyline: frontPts.map(pt).join(' '),
    archBackPolyline: backPts.map(pt).join(' '),
  };
});
</script>

<template>
  <div class="rc">
    <h3 class="rc__title">{{ t.title }}</h3>

    <div class="rc__tabs" role="tablist">
      <button
        v-for="(label, k) in t.kinds"
        :key="k"
        type="button"
        role="tab"
        class="rc__tab"
        :class="{ 'rc__tab--on': kind === k }"
        :aria-selected="kind === k"
        @click="kind = k as RoofKind"
      >
        <svg class="rc__tab-ico" viewBox="0 0 32 16" width="32" height="16" aria-hidden="true">
          <path
            v-if="k === 'arched'"
            fill="none" stroke="currentColor" stroke-width="1.4"
            d="M2 14 Q16 -2 30 14"
          />
          <path
            v-else-if="k === 'single'"
            fill="none" stroke="currentColor" stroke-width="1.4"
            d="M2 13 L30 4"
          />
          <path
            v-else
            fill="none" stroke="currentColor" stroke-width="1.4"
            d="M2 13 L16 4 L30 13"
          />
        </svg>
        <span class="rc__tab-name">{{ label }}</span>
      </button>
    </div>

    <div class="rc__body">
      <h4 class="rc__pane-title rc__cell--title-left">{{ t.sectionLeft }}</h4>
      <h4 class="rc__pane-title rc__cell--title-right">{{ t.sectionRight }}</h4>

      <div class="rc__cell--stage">
        <div class="rc__stage" aria-hidden="true">
          <svg
            class="rc__svg"
            :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="kc-face" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#cdedee" stop-opacity="0.95" />
                <stop offset="45%" stop-color="#6cd4d6" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#1f7a7c" stop-opacity="0.95" />
              </linearGradient>
              <linearGradient id="kc-shine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
                <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
              </linearGradient>
              <filter id="kc-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="kc-soft" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="0.6" />
              </filter>
            </defs>

            <!-- Solid faces — floor + side walls (any kind) -->
            <polygon
              v-for="(face, i) in roofGeometry.faces"
              :key="i"
              :points="face.points"
              class="rc__svg-face"
              :class="face.tone ? `rc__svg-face--${face.tone}` : ''"
            />
            <!-- Curved top for arched: drawn over the end walls -->
            <path
              v-if="roofGeometry.archPath"
              :d="roofGeometry.archPath"
              class="rc__svg-face rc__svg-face--top"
            />
            <!-- glossy highlight on whatever is the topmost face -->
            <polygon
              v-if="!roofGeometry.archPath && roofGeometry.faces.length"
              :points="roofGeometry.faces[roofGeometry.faces.length - 1].points"
              class="rc__svg-shine"
            />

            <!-- Arched: front + back arcs as colored polylines -->
            <polyline
              v-if="roofGeometry.archFrontPolyline"
              :points="roofGeometry.archFrontPolyline"
              class="rc__svg-edge rc__svg-edge--slope1"
              :class="{ 'rc__svg-edge--hot': highlightedEdge === 'slope1' }"
              fill="none"
            />
            <polyline
              v-if="roofGeometry.archBackPolyline"
              :points="roofGeometry.archBackPolyline"
              class="rc__svg-edge rc__svg-edge--slope1"
              :class="{ 'rc__svg-edge--hot': highlightedEdge === 'slope1' }"
              fill="none"
            />

            <!-- Straight edges -->
            <line
              v-for="(e, i) in roofGeometry.edges"
              :key="i"
              :x1="e.x1"
              :y1="e.y1"
              :x2="e.x2"
              :y2="e.y2"
              class="rc__svg-edge"
              :class="[
                `rc__svg-edge--${e.color}`,
                { 'rc__svg-edge--hot': highlightedEdge === e.color },
              ]"
            />
          </svg>
        </div>
      </div>

      <div class="rc__cell--inputs">
        <span class="rc__sizes-key">{{ t.sizesLbl }}</span>
        <div class="rc__sizes">
          <label
            class="rc__size"
            :class="{ 'rc__size--hot': highlightedEdge === 'slope1' }"
            @mouseenter="highlightedEdge = 'slope1'"
            @mouseleave="highlightedEdge = null"
            @focusin="highlightedEdge = 'slope1'"
            @focusout="highlightedEdge = null"
          >
            <span class="rc__size-key">
              <span class="rc__dot rc__dot--slope" />
              A1 <em>{{ t.slope }}</em>
            </span>
            <span class="rc__size-input">
              <button type="button" class="rc__step" :disabled="a1 <= A_MIN" @click="step('a1', -STEP)" aria-label="−">−</button>
              <input type="number" v-model.number="a1" :min="A_MIN" :max="A_MAX" :step="STEP" />
              <span class="rc__size-unit">{{ t.mm }}</span>
              <button type="button" class="rc__step" :disabled="a1 >= A_MAX" @click="step('a1', STEP)" aria-label="+">+</button>
            </span>
          </label>
          <label
            class="rc__size"
            :class="{ 'rc__size--hot': highlightedEdge === 'length1' }"
            @mouseenter="highlightedEdge = 'length1'"
            @mouseleave="highlightedEdge = null"
            @focusin="highlightedEdge = 'length1'"
            @focusout="highlightedEdge = null"
          >
            <span class="rc__size-key">
              <span class="rc__dot rc__dot--length" />
              D1 <em>{{ t.length }}</em>
            </span>
            <span class="rc__size-input">
              <button type="button" class="rc__step" :disabled="d1 <= D_MIN" @click="step('d1', -STEP)" aria-label="−">−</button>
              <input type="number" v-model.number="d1" :min="D_MIN" :max="D_MAX" :step="STEP" />
              <span class="rc__size-unit">{{ t.mm }}</span>
              <button type="button" class="rc__step" :disabled="d1 >= D_MAX" @click="step('d1', STEP)" aria-label="+">+</button>
            </span>
          </label>
          <template v-if="kind === 'double'">
            <label
              class="rc__size"
              :class="{ 'rc__size--hot': highlightedEdge === 'slope2' }"
              @mouseenter="highlightedEdge = 'slope2'"
              @mouseleave="highlightedEdge = null"
              @focusin="highlightedEdge = 'slope2'"
              @focusout="highlightedEdge = null"
            >
              <span class="rc__size-key">
                <span class="rc__dot rc__dot--slope2" />
                A2 <em>{{ t.slope }}</em>
              </span>
              <span class="rc__size-input">
                <button type="button" class="rc__step" :disabled="a2 <= A_MIN" @click="step('a2', -STEP)" aria-label="−">−</button>
                <input type="number" v-model.number="a2" :min="A_MIN" :max="A_MAX" :step="STEP" />
                <span class="rc__size-unit">{{ t.mm }}</span>
                <button type="button" class="rc__step" :disabled="a2 >= A_MAX" @click="step('a2', STEP)" aria-label="+">+</button>
              </span>
            </label>
            <label
              class="rc__size"
              :class="{ 'rc__size--hot': highlightedEdge === 'length2' }"
              @mouseenter="highlightedEdge = 'length2'"
              @mouseleave="highlightedEdge = null"
              @focusin="highlightedEdge = 'length2'"
              @focusout="highlightedEdge = null"
            >
              <span class="rc__size-key">
                <span class="rc__dot rc__dot--length2" />
                D2 <em>{{ t.length }}</em>
              </span>
              <span class="rc__size-input">
                <button type="button" class="rc__step" :disabled="d2 <= D_MIN" @click="step('d2', -STEP)" aria-label="−">−</button>
                <input type="number" v-model.number="d2" :min="D_MIN" :max="D_MAX" :step="STEP" />
                <span class="rc__size-unit">{{ t.mm }}</span>
                <button type="button" class="rc__step" :disabled="d2 >= D_MAX" @click="step('d2', STEP)" aria-label="+">+</button>
              </span>
            </label>
          </template>
        </div>
      </div>

      <ul class="rc__variants rc__cell--variants">
        <li v-for="m in MATERIALS_EN" :key="m.key" class="rc__variant">
            <span
              class="rc__variant-thumb"
              :style="thumbStyle(m, selections[m.key].color)"
              aria-hidden="true"
            />
            <div class="rc__variant-body">
              <span class="rc__variant-name">{{ t.materials[m.key] }}</span>
              <span class="rc__variant-price">{{ fmtPrice(priceFor(m)) }} {{ t.currency }}</span>
            </div>
            <div class="rc__variant-opts">
              <select
                v-model="selections[m.key].color"
                class="rc__select"
                :aria-label="t.color"
              >
                <option v-for="c in m.colorOptions" :key="c" :value="c">{{ c }}</option>
              </select>
              <select
                v-model="selections[m.key].size"
                class="rc__select"
                :aria-label="t.size"
              >
                <option v-for="s in m.sizeOptions" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </li>
        </ul>

      <button type="button" class="rc__calc rc__cell--calc">{{ t.calc }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$slope-1: #38bdf8;     // green в скріні (cyan-ish), використаємо accent
$length-1: #6366f1;    // blue
$slope-2: #f59e0b;     // orange
$length-2: #1e3a8a;    // dark blue
$roof-cyan: #5cd3d6;
$roof-cyan-dark: #2b9b9e;

.rc {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  background: linear-gradient(180deg, var(--color-panel), var(--color-panel-2));
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  padding: $space-4;
  font-family: $font-sans;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35), 0 4px 8px rgba(0, 0, 0, 0.25);
}

.rc__title {
  margin: 0;
  font-size: $fs-sm;
  font-weight: $fw-bold;
  color: var(--color-text-strong);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.rc__tabs {
  display: flex;
  gap: $space-2;
  border-bottom: 1px solid var(--color-border);
}

.rc__tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: $space-2 $space-2 $space-3;
  color: var(--color-muted);
  font-family: $font-sans;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all $transition-fast;

  &:hover {
    color: var(--color-text);
  }

  &--on {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
  }
}

.rc__tab-ico {
  flex-shrink: 0;
}

.rc__tab-name {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: $fw-bold;
  white-space: nowrap;
}

.rc__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  // Row 1 = section titles, Row 2 = stage / variants (1fr stretch),
  // Row 3 = inputs / calc-button.
  grid-template-rows: auto 1fr auto;
  gap: $space-2 $space-4;
  align-items: stretch;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
}

.rc__pane-title {
  margin: 0;
  font-size: $fs-xs;
  font-weight: $fw-semibold;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.rc__cell--title-left { grid-column: 1; grid-row: 1; }
.rc__cell--title-right { grid-column: 2; grid-row: 1; }
.rc__cell--stage {
  grid-column: 1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
}
.rc__cell--variants { grid-column: 2; grid-row: 2; }
.rc__cell--inputs {
  grid-column: 1;
  grid-row: 3;
  display: flex;
  flex-direction: column;
  gap: $space-2;
}
.rc__cell--calc {
  grid-column: 2;
  grid-row: 3;
  align-self: start;   // sit at the TOP of row 3, keep its natural compact size
  width: 100%;
}

@media (max-width: 720px) {
  .rc__cell--title-left, .rc__cell--title-right,
  .rc__cell--stage, .rc__cell--variants,
  .rc__cell--inputs, .rc__cell--calc {
    grid-column: 1;
    grid-row: auto;
  }
}

// SVG stage — fills the available width, draws roof from computed iso projection
.rc__stage {
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at center, color-mix(in srgb, $roof-cyan 10%, transparent), transparent 70%),
    var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: $radius-sm;
  padding: $space-3 $space-2;
  overflow: hidden;
  min-height: 280px;
  flex: 1; // fill the row-2 cell when wrapped in .rc__cell--stage
}

.rc__svg {
  width: 100%;
  height: auto;
  max-height: 320px;
  display: block;
}

.rc__svg-face {
  fill: url(#kc-face);
  stroke: $roof-cyan-dark;
  stroke-width: 0.6;
  stroke-linejoin: round;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35));
}

.rc__svg-face--side {
  // Light off-cream side panels — match the karbosnab.com reference where
  // thickness reads as a clearly contrasting band against the cyan top face.
  fill: #e7eef0;
  stroke: #97a4a8;
  stroke-width: 0.8;
  filter: none;
  opacity: 1;
}

.rc__svg-face--bottom {
  fill: #c9d2d4;
  stroke: #97a4a8;
  stroke-width: 0.6;
  filter: none;
  opacity: 0.9;
}

.rc__svg-shine {
  fill: url(#kc-shine);
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.55;
}

.rc__svg-edge {
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke-width 180ms ease, opacity 180ms ease;
  opacity: 0.92;

  &--slope1 { stroke: $slope-1; }
  &--length1 { stroke: $length-1; }
  &--slope2 { stroke: $slope-2; }
  &--length2 { stroke: $length-2; }

  &--hot {
    stroke-width: 7;
    opacity: 1;
    filter: url(#kc-glow);
  }
}

// Highlight the input row whose edge is currently selected.
.rc__size {
  border-radius: $radius-sm;
  padding: 4px 6px;
  margin: -4px -6px;
  transition: background 160ms ease;
}

.rc__size--hot {
  background: color-mix(in srgb, var(--color-accent) 8%, transparent);
}

.rc__sizes-key {
  font-size: 0.7rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.rc__sizes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-2;
  // Reserve height for the 2-row case (double-slope) so the Calculate button
  // doesn't shift when switching between roof kinds.
  min-height: 132px;
  align-content: start;
}

.rc__size {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rc__size-key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: var(--color-text);
  font-weight: $fw-bold;

  em {
    font-style: normal;
    font-weight: $fw-normal;
    color: var(--color-muted);
    margin-left: 2px;
  }
}

.rc__dot {
  width: 14px;
  height: 3px;
  border-radius: 1px;

  &--slope { background: $slope-1; }
  &--length { background: $length-1; }
  &--slope2 { background: $slope-2; }
  &--length2 { background: $length-2; }
}

.rc__size-input {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: $radius-sm;
  padding: 2px 4px;

  &:focus-within {
    border-color: var(--color-accent);
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    color: var(--color-text-strong);
    font-family: $font-sans;
    font-size: $fs-sm;
    font-weight: $fw-semibold;
    width: 100%;
    min-width: 0;
    padding: 2px 0;
    text-align: right;

    -moz-appearance: textfield;
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}

.rc__size-unit {
  font-size: 0.7rem;
  color: var(--color-muted);
  font-family: $font-mono;
}

.rc__step {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: $radius-sm;
  font-family: $font-sans;
  font-size: $fs-sm;
  font-weight: $fw-bold;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  transition: all $transition-fast;

  &:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: var(--color-bg);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.rc__calc {
  background: var(--color-accent);
  color: var(--color-bg);
  border: 1px solid var(--color-accent);
  border-radius: $radius-sm;
  padding: $space-3 $space-4;
  font-family: $font-sans;
  font-size: $fs-sm;
  font-weight: $fw-bold;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: var(--color-accent-hover);
    border-color: var(--color-accent-hover);
  }
}

// Variants
.rc__variants {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.rc__variant {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) minmax(0, 120px);
  column-gap: $space-3;
  row-gap: 4px;
  padding: $space-3;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: $radius-sm;
  align-items: center;

  flex: 1 1 0;
  min-height: 84px;
}

.rc__variant-thumb {
  width: 56px;
  height: 56px;
  border-radius: $radius-sm;
  border: 1px solid var(--color-border);
  // Background is set inline via :style — depends on selected color.
  transition: background 200ms ease;
  align-self: center;
}

.rc__variant-body {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.rc__variant-name {
  font-size: $fs-xs;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rc__variant-price {
  font-family: $font-mono;
  font-size: $fs-sm;
  font-weight: $fw-bold;
  color: var(--color-text-strong);
  font-variant-numeric: tabular-nums;
}

.rc__variant-opts {
  grid-column: 3;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.rc__select {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 4px $space-2;
  border-radius: $radius-sm;
  font-family: $font-sans;
  font-size: 0.7rem;
  cursor: pointer;
  width: 100%;
  min-width: 0;
  text-overflow: ellipsis;

  &:focus {
    outline: 1px solid var(--color-accent);
    outline-offset: 0;
    border-color: var(--color-accent);
  }
}

.rc__variant-thumb {
  grid-column: 1;
  grid-row: 1;
}
</style>
