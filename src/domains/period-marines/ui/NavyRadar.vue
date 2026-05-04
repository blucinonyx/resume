<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';

interface Blip {
  id: number;
  angle: number;
  distance: number;
  bornAt: number;
}

const i18n = useI18nStore();

const labels = {
  [Lang.EN]: {
    label: 'NAV-RADAR · Ukrainian Marines · 2016—2018',
    sweep: 'sweep',
    contacts: 'contacts',
    heading: 'heading',
    sea: 'sea',
    note: 'Two years on watch shaped how I treat production: stay calm, log everything, hand over cleanly.',
  },
  [Lang.UK]: {
    label: 'NAV-RADAR · ВМС України · 2016—2018',
    sweep: 'обертання',
    contacts: 'контакти',
    heading: 'курс',
    sea: 'море',
    note: 'Два роки вахт навчили як ставитися до прода: спокій, лог усього, чиста передача.',
  },
} as const;
const t = computed(() => labels[i18n.current]);

const sweepAngle = ref(0);
const blips = ref<Blip[]>([]);
let nextId = 1;
let rafId = 0;
const start = performance.now();

function tick(now: number): void {
  const elapsed = now - start;
  sweepAngle.value = (elapsed / 30) % 360;

  // Spawn random blips occasionally
  if (Math.random() < 0.012) {
    blips.value = [
      ...blips.value,
      { id: nextId++, angle: Math.random() * 360, distance: 30 + Math.random() * 60, bornAt: now },
    ];
  }

  // Drop blips older than 4s
  blips.value = blips.value.filter((b) => now - b.bornAt < 4000);

  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  rafId = requestAnimationFrame(tick);
});
onBeforeUnmount(() => cancelAnimationFrame(rafId));

const heading = computed(() => Math.round(180 + Math.sin(sweepAngle.value / 60) * 40));
const seaState = computed(() => 2 + Math.round(Math.abs(Math.sin(sweepAngle.value / 90)) * 2));
</script>

<template>
  <div class="radar">
    <header class="radar__head">
      <span class="radar__label">{{ t.label }}</span>
    </header>

    <div class="radar__scope">
      <div class="radar__rings" aria-hidden="true">
        <span class="radar__ring radar__ring--1" />
        <span class="radar__ring radar__ring--2" />
        <span class="radar__ring radar__ring--3" />
        <span class="radar__crosshair radar__crosshair--h" />
        <span class="radar__crosshair radar__crosshair--v" />
      </div>
      <span class="radar__sweep" :style="{ transform: `rotate(${sweepAngle}deg)` }" />
      <span
        v-for="b in blips"
        :key="b.id"
        class="radar__blip"
        :style="{
          left: `${50 + Math.cos((b.angle * Math.PI) / 180) * b.distance * 0.5}%`,
          top: `${50 + Math.sin((b.angle * Math.PI) / 180) * b.distance * 0.5}%`,
        }"
      />
      <span class="radar__compass radar__compass--n">N</span>
      <span class="radar__compass radar__compass--e">E</span>
      <span class="radar__compass radar__compass--s">S</span>
      <span class="radar__compass radar__compass--w">W</span>
    </div>

    <div class="radar__gauges">
      <div class="radar__gauge">
        <span class="radar__gauge-key">{{ t.contacts }}</span>
        <span class="radar__gauge-val">{{ blips.length.toString().padStart(2, '0') }}</span>
      </div>
      <div class="radar__gauge">
        <span class="radar__gauge-key">{{ t.heading }}</span>
        <span class="radar__gauge-val">{{ heading }}°</span>
      </div>
      <div class="radar__gauge">
        <span class="radar__gauge-key">{{ t.sea }}</span>
        <span class="radar__gauge-val">{{ seaState }}/5</span>
      </div>
    </div>

    <p class="radar__note">{{ t.note }}</p>
  </div>
</template>

<style lang="scss" scoped>
.radar {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
  color: var(--color-text);
}

.radar__head {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
}

.radar__label {
  font-size: $fs-xs;
  color: var(--color-warning);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.radar__scope {
  position: relative;
  aspect-ratio: 1 / 1;
  max-width: 320px;
  margin: 0 auto;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, color-mix(in srgb, var(--color-warning) 8%, transparent), transparent 70%),
    var(--color-panel-2);
  border: 1px solid var(--color-warning);
  overflow: hidden;
}

.radar__rings {
  position: absolute;
  inset: 0;
}

.radar__ring {
  position: absolute;
  border: 1px dashed color-mix(in srgb, var(--color-warning) 40%, transparent);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &--1 { width: 30%; height: 30%; }
  &--2 { width: 60%; height: 60%; }
  &--3 { width: 90%; height: 90%; }
}

.radar__crosshair {
  position: absolute;
  background: color-mix(in srgb, var(--color-warning) 30%, transparent);

  &--h { left: 5%; right: 5%; top: 50%; height: 1px; }
  &--v { top: 5%; bottom: 5%; left: 50%; width: 1px; }
}

.radar__sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 1px;
  transform-origin: 0 0;
  background: linear-gradient(to right, var(--color-warning), transparent);
  box-shadow: 0 0 12px var(--color-warning);
}

.radar__blip {
  position: absolute;
  width: 8px;
  height: 8px;
  margin: -4px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 8px var(--color-success);
  animation: blipFade 4s ease-out forwards;
}

@keyframes blipFade {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.3); }
}

.radar__compass {
  position: absolute;
  font-size: $fs-xs;
  color: var(--color-warning);
  font-weight: $fw-bold;

  &--n { top: 4px; left: 50%; transform: translateX(-50%); }
  &--s { bottom: 4px; left: 50%; transform: translateX(-50%); }
  &--e { right: 6px; top: 50%; transform: translateY(-50%); }
  &--w { left: 6px; top: 50%; transform: translateY(-50%); }
}

.radar__gauges {
  display: flex;
  gap: $space-3;
  flex-wrap: wrap;
}

.radar__gauge {
  flex: 1;
  min-width: 70px;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  padding: $space-2 $space-3;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.radar__gauge-key {
  font-size: 0.62rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.radar__gauge-val {
  font-size: $fs-md;
  font-weight: $fw-bold;
  color: var(--color-warning);
}

.radar__note {
  margin: 0;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  line-height: 1.5;
  padding-top: $space-2;
  border-top: 1px solid var(--color-border);
}
</style>
