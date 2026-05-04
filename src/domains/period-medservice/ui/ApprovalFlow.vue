<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';

interface Token {
  id: number;
  stage: number;
  bornAt: number;
}

const i18n = useI18nStore();

const labels = {
  [Lang.EN]: {
    label: 'Business-process automation · Bitrix corporate portal',
    diploma: 'Best Project · Company Vote',
    stages: ['Request', 'Manager', 'Director', 'Archive'],
    note: 'A workflow that replaced paper sign-offs with a 4-step digital chain. Colleagues voted it best project of the year.',
    processed: 'processed',
  },
  [Lang.UK]: {
    label: 'Автоматизація бізнес-процесів · Bitrix корп. портал',
    diploma: 'Найкращий проект · Голосування',
    stages: ['Заявка', 'Менеджер', 'Директор', 'Архів'],
    note: 'Workflow що замінив паперові підписи 4-етапним цифровим ланцюжком. Колеги обрали проектом року.',
    processed: 'оброблено',
  },
} as const;
const t = computed(() => labels[i18n.current]);

const tokens = ref<Token[]>([]);
const processed = ref(247);
let nextId = 1;
let rafId = 0;

function tick(now: number): void {
  if (Math.random() < 0.018 && tokens.value.length < 6) {
    tokens.value = [...tokens.value, { id: nextId++, stage: 0, bornAt: now }];
  }

  tokens.value = tokens.value
    .map((tk) => {
      const age = now - tk.bornAt;
      const newStage = Math.min(3, Math.floor(age / 900));
      return { ...tk, stage: newStage };
    })
    .filter((tk) => {
      if (tk.stage === 3 && now - tk.bornAt > 3500) {
        processed.value += 1;
        return false;
      }
      return true;
    });

  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  rafId = requestAnimationFrame(tick);
});
onBeforeUnmount(() => cancelAnimationFrame(rafId));
</script>

<template>
  <div class="flow">
    <header class="flow__head">
      <span class="flow__label">{{ t.label }}</span>
      <span class="flow__counter">{{ t.processed }} <strong>{{ processed.toLocaleString('en-US') }}</strong></span>
    </header>

    <div class="flow__diploma" aria-label="Diploma badge">
      <span class="flow__diploma-icon">★</span>
      <span class="flow__diploma-text">{{ t.diploma }}</span>
    </div>

    <div class="flow__chain">
      <template v-for="(stage, idx) in t.stages" :key="stage">
        <div class="flow__stage" :class="`flow__stage--${idx}`">
          <span class="flow__stage-num">{{ String(idx + 1).padStart(2, '0') }}</span>
          <span class="flow__stage-name">{{ stage }}</span>
          <span
            v-for="tk in tokens.filter((x) => x.stage === idx)"
            :key="tk.id"
            class="flow__token"
          />
        </div>
        <span v-if="idx < t.stages.length - 1" class="flow__arrow" aria-hidden="true">→</span>
      </template>
    </div>

    <p class="flow__note">{{ t.note }}</p>
  </div>
</template>

<style lang="scss" scoped>
.flow {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
}

.flow__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
  flex-wrap: wrap;
  gap: $space-2;
}

.flow__label {
  font-size: $fs-xs;
  color: var(--color-accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.flow__counter {
  font-size: $fs-xs;
  color: var(--color-muted);

  strong {
    color: var(--color-success);
    margin-left: $space-1;
    font-weight: $fw-bold;
  }
}

.flow__diploma {
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

.flow__diploma-icon {
  font-size: $fs-md;
  line-height: 1;
}

.flow__chain {
  display: flex;
  align-items: center;
  gap: $space-2;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  padding: $space-3;
  flex-wrap: wrap;
}

.flow__stage {
  position: relative;
  flex: 1;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: $space-3;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  border-left: 2px solid var(--color-accent);
}

.flow__stage--3 {
  border-left-color: var(--color-success);
}

.flow__stage-num {
  font-size: 0.65rem;
  color: var(--color-muted);
  letter-spacing: 0.1em;
}

.flow__stage-name {
  font-size: $fs-sm;
  color: var(--color-text-strong);
  font-weight: $fw-semibold;
}

.flow__token {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: var(--glow-accent);
  animation: tokenIn 200ms ease-out;
}

.flow__stage--3 .flow__token {
  background: var(--color-success);
  box-shadow: var(--glow-success);
}

@keyframes tokenIn {
  from { opacity: 0; transform: scale(0); }
  to { opacity: 1; transform: scale(1); }
}

.flow__arrow {
  color: var(--color-muted);
  font-size: $fs-md;
  flex-shrink: 0;
}

.flow__note {
  margin: 0;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  line-height: 1.5;
}
</style>
