<script setup lang="ts">
import { computed } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';
import type { PeriodMeta, PeriodContent, PeriodSlug } from '@/shared/types/Period';

const props = defineProps<{
  meta: PeriodMeta;
  content: PeriodContent;
  range: string;
}>();

const emit = defineEmits<{
  navigate: [slug: PeriodSlug];
}>();

const i18n = useI18nStore();

const labels = {
  [Lang.EN]: { currently: '// currently', deepDive: 'Deep-dive →' },
  [Lang.UK]: { currently: '// зараз', deepDive: 'Зануритися →' },
} as const;

const t = computed(() => labels[i18n.current]);

const highlights = computed(() => {
  const keys =
    props.content.highlightMetrics ??
    props.content.metrics.slice(0, 3).map((m) => m.key);
  return keys
    .map((key) => props.content.metrics.find((m) => m.key === key))
    .filter((m): m is { key: string; value: string } => Boolean(m))
    .slice(0, 3);
});

function onClick(): void {
  emit('navigate', props.meta.slug);
}
</script>

<template>
  <button type="button" class="pinned" @click="onClick">
    <div class="pinned__label">{{ t.currently }}</div>
    <span class="pinned__name">Olexander Shmakov</span>
    <p class="pinned__role">{{ content.subtitle }} @ {{ content.title }} · {{ range }}</p>

    <p
      v-if="content.pinnedDescription"
      class="pinned__desc"
      v-html="content.pinnedDescription"
    />
    <p v-else class="pinned__desc">{{ content.context }}</p>

    <ul v-if="highlights.length" class="pinned__chips">
      <li v-for="m in highlights" :key="m.key" class="pinned__chip">
        {{ m.value }}
      </li>
    </ul>

    <span class="pinned__cta" aria-hidden="true">{{ t.deepDive }}</span>
  </button>
</template>

<style scoped lang="scss">
@keyframes pinnedIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pinned {
  // Reset button defaults
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(135deg, var(--color-panel), var(--color-panel-2));
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-accent);
  border-radius: $radius-lg;
  padding: 1.25rem 1.4rem;
  margin: 0;
  width: 100%;
  display: block;
  text-align: left;
  color: inherit;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.35),
    var(--glow-accent, 0 0 0 transparent);
  opacity: 0;
  animation: pinnedIn 300ms ease-out forwards;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 30px rgba(0, 0, 0, 0.45),
      0 0 0 1px var(--color-accent);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
  }
}

.pinned__label {
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.pinned__name {
  font-family: $font-sans;
  font-size: $fs-2xl;
  font-weight: $fw-black;
  color: var(--color-text-strong);
  letter-spacing: -0.02em;
  margin: 0.4rem 0 0.2rem;
}

.pinned__role {
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  margin: 0;
}

.pinned__desc {
  font-family: $font-sans;
  font-size: $fs-base;
  color: var(--color-text);
  line-height: 1.55;
  margin: 0.85rem 0 0;

  :deep(b) {
    color: var(--color-accent);
    font-weight: $fw-bold;
  }
}

.pinned__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.85rem 0 0;
  padding: 0;
  list-style: none;
}

.pinned__chip {
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--color-accent);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: $radius-sm;
  padding: 0.2rem 0.55rem;
}

.pinned__cta {
  display: block;
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--color-accent);
  text-align: right;
  margin-top: 0.85rem;
}

@media (max-width: 640px) {
  .pinned {
    padding: 1rem;
  }

  .pinned__name {
    font-size: $fs-xl;
  }
}
</style>
