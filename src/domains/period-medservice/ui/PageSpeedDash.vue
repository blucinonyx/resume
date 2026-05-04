<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';

interface Metric {
  key: string;
  value: string;
}

const i18n = useI18nStore();

const labels = {
  [Lang.EN]: {
    title: 'PageSpeed Insights · apteka-med-service.ru',
    mobile: 'Mobile',
    desktop: 'Desktop',
    diploma: 'Best Project · Company Vote',
    note: 'Visit card for the pharmacy on WordPress — custom theme written from scratch plus my own plugins. Hit 100 / 100 on both Mobile and Desktop with the PageSpeed algorithms of the time.',
    metrics: [
      { key: 'FCP', value: '1.2s' },
      { key: 'LCP', value: '1.8s' },
      { key: 'CLS', value: '0.00' },
      { key: 'TTI', value: '2.1s' },
    ] as Metric[],
  },
  [Lang.UK]: {
    title: 'PageSpeed Insights · apteka-med-service.ru',
    mobile: 'Mobile',
    desktop: 'Desktop',
    diploma: 'Найкращий проект · Голосування',
    note: 'Візит-кард аптеки на WordPress — тема написана з нуля + власні плагіни. Здобув 100 / 100 і на Mobile, і на Desktop за алгоритмами PageSpeed того часу.',
    metrics: [
      { key: 'FCP', value: '1.2с' },
      { key: 'LCP', value: '1.8с' },
      { key: 'CLS', value: '0.00' },
      { key: 'TTI', value: '2.1с' },
    ] as Metric[],
  },
} as const;
const t = computed(() => labels[i18n.current]);

const mobileScore = ref(0);
const desktopScore = ref(0);

let raf = 0;
let animStart = 0;

function easeOut(p: number): number {
  return 1 - Math.pow(1 - p, 3);
}

function animate(now: number): void {
  const elapsed = now - animStart;
  const duration = 1700;
  const p = Math.min(1, elapsed / duration);
  const eased = easeOut(p);
  mobileScore.value = Math.round(eased * 100);
  // desktop kicks in slightly later for staggered effect
  const dp = Math.max(0, Math.min(1, (elapsed - 250) / duration));
  desktopScore.value = Math.round(easeOut(dp) * 100);
  if (p < 1 || dp < 1) {
    raf = requestAnimationFrame(animate);
  }
}

function start(): void {
  cancelAnimationFrame(raf);
  mobileScore.value = 0;
  desktopScore.value = 0;
  animStart = performance.now();
  raf = requestAnimationFrame(animate);
}

onMounted(() => start());
onBeforeUnmount(() => cancelAnimationFrame(raf));

// SVG circle geometry
const RADIUS = 42;
const STROKE = 8;
const CIRC = 2 * Math.PI * RADIUS;

function dashOffset(score: number): number {
  return CIRC * (1 - score / 100);
}

function scoreColor(score: number): string {
  if (score >= 90) return '#0cce6b'; // PageSpeed green
  if (score >= 50) return '#ffa400'; // orange
  return '#ff4e42'; // red
}
</script>

<template>
  <div class="ps">
    <header class="ps__head">
      <span class="ps__title">{{ t.title }}</span>
      <button type="button" class="ps__rerun" @click="start" aria-label="re-run">⟲</button>
    </header>

    <div class="ps__gauges">
      <div class="ps__gauge">
        <svg class="ps__svg" viewBox="0 0 100 100" aria-hidden="true">
          <circle
            class="ps__track"
            cx="50" cy="50" :r="RADIUS"
            :stroke-width="STROKE"
            fill="none"
          />
          <circle
            class="ps__bar"
            cx="50" cy="50" :r="RADIUS"
            :stroke-width="STROKE"
            :stroke="scoreColor(mobileScore)"
            :stroke-dasharray="CIRC"
            :stroke-dashoffset="dashOffset(mobileScore)"
            fill="none"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span
          class="ps__score"
          :style="{ color: scoreColor(mobileScore) }"
        >{{ mobileScore }}</span>
        <span class="ps__label">{{ t.mobile }}</span>
      </div>
      <div class="ps__gauge">
        <svg class="ps__svg" viewBox="0 0 100 100" aria-hidden="true">
          <circle
            class="ps__track"
            cx="50" cy="50" :r="RADIUS"
            :stroke-width="STROKE"
            fill="none"
          />
          <circle
            class="ps__bar"
            cx="50" cy="50" :r="RADIUS"
            :stroke-width="STROKE"
            :stroke="scoreColor(desktopScore)"
            :stroke-dasharray="CIRC"
            :stroke-dashoffset="dashOffset(desktopScore)"
            fill="none"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span
          class="ps__score"
          :style="{ color: scoreColor(desktopScore) }"
        >{{ desktopScore }}</span>
        <span class="ps__label">{{ t.desktop }}</span>
      </div>
    </div>

    <ul class="ps__metrics">
      <li v-for="m in t.metrics" :key="m.key" class="ps__metric">
        <span class="ps__check" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14">
            <path
              fill="none"
              stroke="#0cce6b"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 8 L7 12 L13 4"
            />
          </svg>
        </span>
        <span class="ps__metric-k">{{ m.key }}</span>
        <span class="ps__metric-v">{{ m.value }}</span>
      </li>
    </ul>

    <div class="ps__diploma" aria-label="diploma">
      <span class="ps__diploma-icon">★</span>
      <span class="ps__diploma-text">{{ t.diploma }}</span>
    </div>

    <p class="ps__note">{{ t.note }}</p>
  </div>
</template>

<style lang="scss" scoped>
.ps {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
}

.ps__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
}

.ps__title {
  font-size: $fs-xs;
  color: #0cce6b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: $fw-bold;
}

.ps__rerun {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-muted);
  width: 28px;
  height: 28px;
  border-radius: $radius-sm;
  cursor: pointer;
  font-family: $font-mono;
  font-size: $fs-sm;
  line-height: 1;
  transition: all $transition-fast;

  &:hover {
    border-color: #0cce6b;
    color: #0cce6b;
  }
}

.ps__gauges {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
  padding: $space-4 0 $space-2;
}

.ps__gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: 150px;
}

.ps__svg {
  width: 130px;
  height: 130px;
  filter: drop-shadow(0 0 14px color-mix(in srgb, #0cce6b 30%, transparent));
}

.ps__track {
  stroke: color-mix(in srgb, #0cce6b 18%, transparent);
}

.ps__bar {
  transition: stroke-dashoffset 80ms linear, stroke 200ms ease;
  stroke-linecap: round;
}

.ps__score {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% - 8px));
  font-family: $font-sans;
  font-size: 2.2rem;
  font-weight: $fw-black;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  transition: color 200ms ease;
}

.ps__label {
  position: absolute;
  bottom: 4px;
  font-size: 0.7rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.ps__metrics {
  list-style: none;
  margin: 0;
  padding: $space-3;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: $space-2;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
}

.ps__metric {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $fs-xs;
}

.ps__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 50%;
  background: color-mix(in srgb, #0cce6b 14%, transparent);
}

.ps__metric-k {
  color: var(--color-muted);
  font-weight: $fw-semibold;
  letter-spacing: 0.04em;
}

.ps__metric-v {
  margin-left: auto;
  color: var(--color-text-strong);
  font-family: $font-mono;
  font-weight: $fw-bold;
}

.ps__diploma {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-3;
  background: linear-gradient(135deg, var(--color-warning), color-mix(in srgb, var(--color-warning) 70%, var(--color-magenta)));
  color: var(--color-bg);
  border-radius: $radius-md;
  font-size: $fs-xs;
  font-weight: $fw-bold;
  letter-spacing: 0.04em;
  box-shadow: var(--glow-warning);
}

.ps__diploma-icon {
  font-size: $fs-md;
  line-height: 1;
}

.ps__note {
  margin: 0;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  line-height: 1.5;
}
</style>
