<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { IngestionSimulator } from '../services/IngestionSimulator';
import { usePipelineStore } from '../stores/PipelineStore';
import { useLang } from '@/shared/composables/useLang';
import { FormatService } from '@/shared/utils/format';

const store = usePipelineStore();
const lang = useLang();
const t = computed(() => lang.value.periods.keyapp);

onMounted(() => store.start());
onBeforeUnmount(() => store.pause());

const formattedTotal = computed(() => FormatService.thousands(store.totalToday));
const formattedEps = computed(() => FormatService.thousands(store.eventsPerSec));
const bars = computed(() => IngestionSimulator.barHeights(store.sparkValues));
</script>

<template>
  <div class="pipe" :class="{ 'pipe--paused': !store.isRunning }">
    <header class="pipe__head">
      <span class="pipe__live">{{ t.title }}</span>
    </header>

    <div class="pipe__counter">{{ formattedTotal }}</div>
    <div class="pipe__counter-lbl">{{ t.counterLbl }}</div>

    <div class="pipe__spark" aria-hidden="true">
      <span
        v-for="(h, i) in bars"
        :key="i"
        class="pipe__bar"
        :style="{ height: `${h}%` }"
      />
    </div>

    <div class="pipe__meta">
      <span>{{ t.eps }} <strong>▲ {{ formattedEps }}</strong></span>
      <span>{{ t.p99 }} <strong>{{ store.current?.p99 ?? 0 }}ms</strong></span>
      <span>{{ t.backp }} <strong>{{ store.current?.backpressurePct ?? 0 }}%</strong></span>
    </div>

    <div class="pipe__controls">
      <button
        type="button"
        class="pipe__btn pipe__btn--primary"
        :disabled="store.isRunning"
        @click="store.start()"
      >
        {{ t.start }}
      </button>
      <button
        type="button"
        class="pipe__btn"
        :disabled="!store.isRunning"
        @click="store.pause()"
      >
        {{ t.pause }}
      </button>
      <button class="pipe__btn" type="button" @click="store.reset()">{{ t.reset }}</button>
    </div>

    <div class="pipe__flow" :class="{ 'pipe__flow--paused': !store.isRunning }">
      <div class="pipe__node pipe__node--in">{{ t.sourceN }}</div>
      <div class="pipe__line">
        <span class="pipe__dot pipe__dot--a" />
        <span class="pipe__dot pipe__dot--b" />
        <span class="pipe__dot pipe__dot--c" />
      </div>
      <div class="pipe__node pipe__node--queue">{{ t.queueN }}</div>
      <div class="pipe__line">
        <span class="pipe__dot pipe__dot--a" />
        <span class="pipe__dot pipe__dot--b" />
        <span class="pipe__dot pipe__dot--c" />
      </div>
      <div class="pipe__node">{{ t.workerN }}</div>
      <div class="pipe__line">
        <span class="pipe__dot pipe__dot--a" />
        <span class="pipe__dot pipe__dot--b" />
      </div>
      <div class="pipe__node pipe__node--out">{{ t.sinkN }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="@/domains/period-keyapp/styles/PipelineSimulator.scss"></style>
