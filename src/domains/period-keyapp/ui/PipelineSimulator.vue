<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { usePipelineStore } from '../stores/PipelineStore';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';

const store = usePipelineStore();
const i18n = useI18nStore();

const labels = {
  [Lang.EN]: {
    title: 'Pipeline simulator · live',
    counterLbl: 'events ingested today · target 124M',
    eps: 'events/sec',
    p99: 'p99',
    backp: 'backpressure',
    start: '▶ Start',
    pause: '⏸ Pause',
    reset: '⟲ Reset',
    sourceN: 'events.source',
    queueN: 'RabbitMQ',
    workerN: 'Workers',
    sinkN: 'ClickHouse',
  },
  [Lang.UK]: {
    title: 'Симулятор пайплайну · live',
    counterLbl: 'подій оброблено сьогодні · ціль 124М',
    eps: 'подій/сек',
    p99: 'p99',
    backp: 'тиск',
    start: '▶ Старт',
    pause: '⏸ Пауза',
    reset: '⟲ Скинути',
    sourceN: 'events.source',
    queueN: 'RabbitMQ',
    workerN: 'Воркери',
    sinkN: 'ClickHouse',
  },
} as const;
const t = computed(() => labels[i18n.current]);

onMounted(() => store.start());
onBeforeUnmount(() => store.pause());

const formattedTotal = computed(() => store.totalToday.toLocaleString('en-US'));

// Build sparkline bar heights (min 25% so flat bars are still visible)
const bars = computed(() => {
  const values = store.sparkValues;
  if (values.length === 0) return Array.from({ length: 24 }, () => 25);
  const max = Math.max(...values, 1);
  const padded = [...Array(Math.max(0, 24 - values.length)).fill(0), ...values];
  return padded.slice(-24).map((v) => 25 + (v / max) * 75);
});
</script>

<template>
  <div class="pipe">
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
      <span>{{ t.eps }} <strong>▲ {{ store.eventsPerSec.toLocaleString('en-US') }}</strong></span>
      <span>{{ t.p99 }} <strong>{{ store.current?.p99 ?? 0 }}ms</strong></span>
      <span>{{ t.backp }} <strong>{{ store.current?.backpressurePct ?? 0 }}%</strong></span>
    </div>

    <div class="pipe__controls">
      <button class="pipe__btn pipe__btn--primary" type="button" @click="store.start()">
        {{ t.start }}
      </button>
      <button class="pipe__btn" type="button" @click="store.pause()">{{ t.pause }}</button>
      <button class="pipe__btn" type="button" @click="store.reset()">{{ t.reset }}</button>
    </div>

    <div class="pipe__flow">
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

<style lang="scss" scoped>
.pipe {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
}

.pipe__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
  margin-bottom: $space-2;
}

.pipe__live {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  font-size: $fs-xs;
  color: var(--color-success);
  text-transform: uppercase;
  letter-spacing: 0.06em;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: $radius-full;
    background: var(--color-success);
    box-shadow: var(--glow-success);
    animation: pulse 1.4s infinite;
  }
}

@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}

.pipe__counter {
  font-size: 2.4rem;
  font-weight: $fw-bold;
  color: var(--color-success);
  line-height: 1;
}

.pipe__counter-lbl {
  color: var(--color-muted);
  font-size: $fs-xs;
  margin-bottom: $space-3;
}

.pipe__spark {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 56px;
  margin-bottom: $space-2;
}

.pipe__bar {
  width: 6px;
  background: linear-gradient(to top, var(--color-accent), var(--color-accent-hover));
  border-radius: 2px;
  transition: height $transition-fast linear;
}

.pipe__meta {
  display: flex;
  gap: $space-4;
  flex-wrap: wrap;
  color: var(--color-muted);
  font-size: $fs-xs;
  margin-bottom: $space-3;

  strong {
    color: var(--color-accent);
    font-weight: $fw-semibold;
  }
}

.pipe__controls {
  display: flex;
  gap: $space-2;
  margin-bottom: $space-4;
}

.pipe__btn {
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: $space-2 $space-3;
  border-radius: $radius-md;
  font-family: $font-mono;
  font-size: $fs-xs;
  transition: all $transition-fast;

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  &--primary {
    background: var(--color-accent);
    color: var(--color-bg);
    border-color: var(--color-accent);

    &:hover {
      background: var(--color-accent-hover);
      border-color: var(--color-accent-hover);
      color: var(--color-bg);
    }
  }
}

.pipe__flow {
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  padding: $space-4;
  display: flex;
  align-items: center;
  gap: $space-2;
  flex-wrap: wrap;
}

.pipe__node {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  padding: $space-2 $space-3;
  font-size: 0.72rem;
  white-space: nowrap;
  z-index: 2;

  &--in {
    border-color: var(--color-success);
    color: var(--color-success);
  }
  &--queue {
    border-color: var(--color-warning);
    color: var(--color-warning);
  }
  &--out {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}

.pipe__line {
  flex: 1;
  min-width: 30px;
  height: 2px;
  background: var(--color-border);
  position: relative;
  z-index: 1;
}

.pipe__dot {
  position: absolute;
  top: 50%;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: $radius-full;
  background: var(--color-success);
  transform: translateY(-50%);
  box-shadow: var(--glow-success);
  animation: flow 2s linear infinite;

  &--b {
    animation-delay: 0.5s;
    background: var(--color-accent);
    box-shadow: var(--glow-accent);
  }
  &--c {
    animation-delay: 1s;
    background: var(--color-warning);
    box-shadow: var(--glow-warning);
  }
}

@keyframes flow {
  from {
    left: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  to {
    left: 100%;
    opacity: 0;
  }
}
</style>
