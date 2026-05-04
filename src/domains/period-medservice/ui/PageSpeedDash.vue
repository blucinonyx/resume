<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLang } from '@/shared/composables/useLang';
import { PageSpeedAnimService } from '../services/PageSpeedAnimService';

const lang = useLang();
const t = computed(() => lang.value.periods.medservice.pageSpeed);

const mobileScore = ref(0);
const desktopScore = ref(0);

let raf = 0;
let animStart = 0;

function animate(now: number): void {
  const elapsed = now - animStart;
  mobileScore.value = PageSpeedAnimService.scoreAt(PageSpeedAnimService.mobileProgress(elapsed));
  desktopScore.value = PageSpeedAnimService.scoreAt(PageSpeedAnimService.desktopProgress(elapsed));
  if (!PageSpeedAnimService.isComplete(elapsed)) {
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

const RADIUS = PageSpeedAnimService.RADIUS;
const STROKE = PageSpeedAnimService.STROKE;
const CIRC = PageSpeedAnimService.CIRC;
const dashOffset = PageSpeedAnimService.dashOffset;
const scoreColor = PageSpeedAnimService.scoreColor;
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

<style lang="scss" scoped src="@/domains/period-medservice/styles/PageSpeedDash.scss"></style>
