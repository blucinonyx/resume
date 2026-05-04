<script setup lang="ts">
import { computed } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';

interface Node {
  key: string;
  label: string;
}

const i18n = useI18nStore();

const labels = {
  [Lang.EN]: {
    title: 'Skill tree · GoIT online bootcamp',
    legendUnlocked: 'completed',
    note: 'Frontend fundamentals — HTML, CSS and JavaScript modules. Used as a structured way to fill gaps after years of self-taught backend work.',
    nodes: [
      { key: 'html', label: 'HTML' },
      { key: 'css', label: 'CSS' },
      { key: 'js', label: 'JavaScript' },
    ] as Node[],
  },
  [Lang.UK]: {
    title: 'Skill tree · GoIT bootcamp',
    legendUnlocked: 'пройдено',
    note: 'Frontend-фундамент — модулі HTML, CSS, JavaScript. Структурований спосіб закрити прогалини після років самонавчання на бекенді.',
    nodes: [
      { key: 'html', label: 'HTML' },
      { key: 'css', label: 'CSS' },
      { key: 'js', label: 'JavaScript' },
    ] as Node[],
  },
} as const;
const t = computed(() => labels[i18n.current]);
</script>

<template>
  <div class="tree">
    <header class="tree__head">
      <span class="tree__title">{{ t.title }}</span>
      <div class="tree__legend">
        <span class="tree__leg tree__leg--on"><span class="tree__dot tree__dot--on" />{{ t.legendUnlocked }}</span>
      </div>
    </header>

    <ol class="tree__nodes">
      <li
        v-for="(n, i) in t.nodes"
        :key="n.key"
        class="tree__node tree__node--on"
      >
        <span class="tree__order">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="tree__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 12l5 5L20 7"
            />
          </svg>
        </span>
        <span class="tree__label">{{ n.label }}</span>
      </li>
    </ol>

    <p class="tree__note">{{ t.note }}</p>
  </div>
</template>

<style lang="scss" scoped>
.tree {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
}

.tree__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
  flex-wrap: wrap;
  gap: $space-2;
}

.tree__title {
  font-size: $fs-xs;
  color: var(--color-type-edu);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tree__legend {
  display: flex;
  gap: $space-3;
  font-size: 0.65rem;
}

.tree__leg {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  color: var(--color-muted);
}

.tree__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &--on { background: var(--color-success); }
  &--off { background: var(--color-muted); opacity: 0.4; }
}

.tree__nodes {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $space-2;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 24px;
    top: 16px;
    bottom: 16px;
    width: 2px;
    background: var(--color-border);
  }
}

.tree__node {
  position: relative;
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-2 $space-3 $space-2 $space-2;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  font-size: $fs-sm;

  &--on {
    border-left: 3px solid var(--color-success);
    color: var(--color-text-strong);
  }
  &--off {
    border-left: 3px solid color-mix(in srgb, var(--color-muted) 50%, transparent);
    color: var(--color-muted);
    background: color-mix(in srgb, var(--color-panel-2) 60%, transparent);
  }
}

.tree__order {
  font-size: 0.62rem;
  color: var(--color-muted);
  letter-spacing: 0.1em;
}

.tree__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-panel);
  flex-shrink: 0;

  .tree__node--on & { color: var(--color-success); }
  .tree__node--off & { color: var(--color-muted); opacity: 0.6; }
}

.tree__label {
  font-weight: $fw-semibold;
  flex-shrink: 0;
}

.tree__hint {
  margin-left: auto;
  font-size: $fs-xs;
  color: var(--color-muted);
  font-style: italic;
}

.tree__note {
  margin: 0;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  line-height: 1.5;
}
</style>
