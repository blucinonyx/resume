<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLang } from '@/shared/composables/useLang';
import {
  MATERIALS,
  ROOF_LIMITS,
  RoofGeometryService,
  VIEW_H,
  VIEW_W,
} from '../services/RoofGeometryService';
import type {
  EdgeColor,
  Material,
  RoofKind,
  Selection,
} from '../interface/RoofTypes';

const lang = useLang();
const t = computed(() => lang.value.periods.karbosnab);

const kind = ref<RoofKind>('single');
const a1 = ref(4000);
const d1 = ref(6000);
const a2 = ref(4000);
const d2 = ref(6000);

function step(target: 'a1' | 'd1' | 'a2' | 'd2', delta: number): void {
  const refMap = { a1, d1, a2, d2 };
  const axis: 'slope' | 'length' = target === 'a1' || target === 'a2' ? 'slope' : 'length';
  const r = refMap[target];
  r.value = RoofGeometryService.stepDimension(r.value, delta, axis);
}

const selections = ref<Record<Material['key'], Selection>>({
  monolithic: { color: 'transparent', size: '2 mm' },
  profiled: { color: 'transparent', size: '0.8 mm' },
  honeycomb: { color: 'graphite', size: 'PREMIUM' },
});

// Smoothed (animated) dimensions and rotation angle. The raw `a1/d1/a2/d2`
// refs are bound to the inputs; the *Sm refs lerp toward them so a click on
// +/- visibly redraws the figure rather than snapping.
const a1Sm = ref(a1.value);
const d1Sm = ref(d1.value);
const a2Sm = ref(a2.value);
const d2Sm = ref(d2.value);
const aRot = ref(0); // radians, gentle Y-axis oscillation
const highlightedEdge = ref<EdgeColor | null>(null);

const areaM2 = computed(() =>
  RoofGeometryService.areaM2(kind.value, {
    a1: a1.value, d1: d1.value, a2: a2.value, d2: d2.value,
  }),
);

function priceFor(material: Material): number {
  return RoofGeometryService.priceFor(material, areaM2.value);
}

function fmtPrice(value: number): string {
  return RoofGeometryService.formatPrice(value);
}

function thumbStyle(material: Material, color: string): Record<string, string> {
  return RoofGeometryService.thumbStyle(material, color);
}

let raf = 0;
const startTime = performance.now();
function tick(now: number): void {
  aRot.value = RoofGeometryService.oscillationRad(now - startTime);
  a1Sm.value = RoofGeometryService.lerp(a1Sm.value, a1.value);
  d1Sm.value = RoofGeometryService.lerp(d1Sm.value, d1.value);
  a2Sm.value = RoofGeometryService.lerp(a2Sm.value, a2.value);
  d2Sm.value = RoofGeometryService.lerp(d2Sm.value, d2.value);
  raf = requestAnimationFrame(tick);
}
onMounted(() => { raf = requestAnimationFrame(tick); });
onBeforeUnmount(() => cancelAnimationFrame(raf));

const roofGeometry = computed(() =>
  RoofGeometryService.build(
    kind.value,
    { a1: a1Sm.value, d1: d1Sm.value, a2: a2Sm.value, d2: d2Sm.value },
    aRot.value,
  ),
);
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
              <button type="button" class="rc__step" :disabled="a1 <= ROOF_LIMITS.slopeMin" @click="step('a1', -ROOF_LIMITS.step)" aria-label="−">−</button>
              <input type="number" v-model.number="a1" :min="ROOF_LIMITS.slopeMin" :max="ROOF_LIMITS.slopeMax" :step="ROOF_LIMITS.step" />
              <span class="rc__size-unit">{{ t.mm }}</span>
              <button type="button" class="rc__step" :disabled="a1 >= ROOF_LIMITS.slopeMax" @click="step('a1', ROOF_LIMITS.step)" aria-label="+">+</button>
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
              <button type="button" class="rc__step" :disabled="d1 <= ROOF_LIMITS.lengthMin" @click="step('d1', -ROOF_LIMITS.step)" aria-label="−">−</button>
              <input type="number" v-model.number="d1" :min="ROOF_LIMITS.lengthMin" :max="ROOF_LIMITS.lengthMax" :step="ROOF_LIMITS.step" />
              <span class="rc__size-unit">{{ t.mm }}</span>
              <button type="button" class="rc__step" :disabled="d1 >= ROOF_LIMITS.lengthMax" @click="step('d1', ROOF_LIMITS.step)" aria-label="+">+</button>
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
                <button type="button" class="rc__step" :disabled="a2 <= ROOF_LIMITS.slopeMin" @click="step('a2', -ROOF_LIMITS.step)" aria-label="−">−</button>
                <input type="number" v-model.number="a2" :min="ROOF_LIMITS.slopeMin" :max="ROOF_LIMITS.slopeMax" :step="ROOF_LIMITS.step" />
                <span class="rc__size-unit">{{ t.mm }}</span>
                <button type="button" class="rc__step" :disabled="a2 >= ROOF_LIMITS.slopeMax" @click="step('a2', ROOF_LIMITS.step)" aria-label="+">+</button>
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
                <button type="button" class="rc__step" :disabled="d2 <= ROOF_LIMITS.lengthMin" @click="step('d2', -ROOF_LIMITS.step)" aria-label="−">−</button>
                <input type="number" v-model.number="d2" :min="ROOF_LIMITS.lengthMin" :max="ROOF_LIMITS.lengthMax" :step="ROOF_LIMITS.step" />
                <span class="rc__size-unit">{{ t.mm }}</span>
                <button type="button" class="rc__step" :disabled="d2 >= ROOF_LIMITS.lengthMax" @click="step('d2', ROOF_LIMITS.step)" aria-label="+">+</button>
              </span>
            </label>
          </template>
        </div>
      </div>

      <ul class="rc__variants rc__cell--variants">
        <li v-for="m in MATERIALS" :key="m.key" class="rc__variant">
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

<style lang="scss" scoped src="@/domains/period-karbosnab/styles/PolycarbCalculator.scss"></style>
