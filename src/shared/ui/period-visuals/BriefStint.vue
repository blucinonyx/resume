<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { ContentService } from '@/domains/resume/services/ContentService';
import { Lang } from '@/shared/types/Lang';
import { PeriodSlug } from '@/shared/types/Period';

const route = useRoute();
const i18n = useI18nStore();

const currentSlug = computed<PeriodSlug | null>(() => {
  const raw = route.params.slug;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  return Object.values(PeriodSlug).includes(value as PeriodSlug)
    ? (value as PeriodSlug)
    : null;
});

const meta = computed(() => (currentSlug.value ? ContentService.meta(currentSlug.value) : null));
const content = computed(() =>
  currentSlug.value ? ContentService.content(currentSlug.value, i18n.current) : null,
);
const range = computed(() =>
  meta.value ? ContentService.formatRange(meta.value, i18n.current) : '',
);

const labels = {
  [Lang.EN]: {
    ticketsClosed: 'tasks closed',
    blurbs: {
      [PeriodSlug.ClickDealer]: 'Internal portal at clickdealer.com (CPA / performance-marketing network, ~40B monthly impressions). Worked on Silex/PHP back-office, not the public ad platform.',
      [PeriodSlug.Rechout]: 'Catalogue project on C# + Web API + Angular — closed the assigned scope, then moved on.',
    } as Partial<Record<PeriodSlug, string>>,
  },
  [Lang.UK]: {
    ticketsClosed: 'задач виконано',
    blurbs: {
      [PeriodSlug.ClickDealer]: 'Внутрішній портал на clickdealer.com (CPA / performance-marketing мережа, ~40 млрд показів/міс). Працював у Silex/PHP back-office, не на публічній ad-платформі.',
      [PeriodSlug.Rechout]: 'Каталог-проект на C# + Web API + Angular — закрив скоуп, далі рухався далі.',
    } as Partial<Record<PeriodSlug, string>>,
  },
} as const;

const t = computed(() => labels[i18n.current]);

const ticketCount = computed<number>(() =>
  currentSlug.value === PeriodSlug.ClickDealer ? 12 : 8,
);

const blurb = computed<string>(() => {
  const slug = currentSlug.value;
  if (!slug) return '';
  return t.value.blurbs[slug] ?? content.value?.context ?? '';
});

const headerLabel = computed<string>(() => {
  if (!content.value || !meta.value) return '';
  return `${content.value.title} · ${content.value.subtitle} · ${range.value}`;
});

const stack = computed<readonly string[]>(() => content.value?.stack ?? []);
</script>

<template>
  <div class="brief">
    <header class="brief__head">
      <span class="brief__label">{{ headerLabel }}</span>
    </header>

    <div class="brief__panel">
      <div class="brief__counter">
        <span class="brief__counter-num">{{ ticketCount }}</span>
        <span class="brief__counter-key">{{ t.ticketsClosed }}</span>
      </div>

      <div class="brief__stack">
        <span v-for="s in stack" :key="s" class="brief__chip">{{ s }}</span>
      </div>
    </div>

    <p class="brief__sentence">// {{ blurb }}</p>
  </div>
</template>

<style lang="scss" scoped>
.brief {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
}

.brief__head {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
}

.brief__label {
  font-size: $fs-xs;
  color: var(--color-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.brief__panel {
  display: flex;
  align-items: center;
  gap: $space-5;
  padding: $space-5 $space-4;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-muted);
  border-radius: $radius-md;
  flex-wrap: wrap;
}

.brief__counter {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brief__counter-num {
  font-size: 2.2rem;
  font-weight: $fw-bold;
  color: var(--color-text-strong);
  line-height: 1;
}

.brief__counter-key {
  font-size: 0.65rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.brief__stack {
  display: flex;
  flex-wrap: wrap;
  gap: $space-1;
}

.brief__chip {
  font-size: 0.65rem;
  padding: 2px 8px;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: $radius-sm;
  color: var(--color-text);
}

.brief__sentence {
  margin: 0;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  line-height: 1.5;
  font-style: italic;
}
</style>
