<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLang } from '@/shared/composables/useLang';
import { FormatService } from '@/shared/utils/format';
import { RadarMathService } from '../services/RadarMathService';
import type { Blip } from '../interface/RadarTypes';

const lang = useLang();
const t = computed(() => lang.value.periods.marines);

const sweepAngle = ref(0);
const blips = ref<Blip[]>([]);
let nextId = 1;
let rafId = 0;
const startedAt = performance.now();

function tick(now: number): void {
  const result = RadarMathService.tick(blips.value, now - startedAt, now, () => nextId++);
  sweepAngle.value = result.sweepDeg;
  blips.value = result.blips;
  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  rafId = requestAnimationFrame(tick);
});
onBeforeUnmount(() => cancelAnimationFrame(rafId));

const heading = computed(() => RadarMathService.headingFromSweep(sweepAngle.value));
const seaState = computed(() => RadarMathService.seaStateFromSweep(sweepAngle.value));
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
          left: `${RadarMathService.contactPosition(b.angle, b.distance).leftPct}%`,
          top: `${RadarMathService.contactPosition(b.angle, b.distance).topPct}%`,
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
        <span class="radar__gauge-val">{{ FormatService.pad(blips.length) }}</span>
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

<style lang="scss" scoped src="@/domains/period-marines/styles/NavyRadar.scss"></style>
