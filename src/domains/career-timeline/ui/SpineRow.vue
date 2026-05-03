<script setup lang="ts">
import { PeriodType, type PeriodMeta, type PeriodContent, type PeriodSlug } from '@/shared/types/Period';

const props = defineProps<{
  meta: PeriodMeta;
  content: PeriodContent;
  range: string;
  index: number;
}>();

const emit = defineEmits<{
  navigate: [slug: PeriodSlug];
}>();

function handleClick(): void {
  emit('navigate', props.meta.slug);
}
</script>

<template>
  <button
    type="button"
    class="row"
    :class="`row--${meta.type}`"
    :style="{ '--row-index': index }"
    @click="handleClick"
  >
    <span class="row__main">
      <span class="row__icon" aria-hidden="true">
        <svg
          v-if="meta.type === PeriodType.Education"
          viewBox="0 0 24 24"
          width="18"
          height="18"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2 9l10-5 10 5-10 5L2 9zm5 3.2v4.3c0 1 4 2.5 5 2.5s5-1.5 5-2.5v-4.3M21 9.5v6"
          />
        </svg>
        <svg
          v-else-if="meta.type === PeriodType.Military"
          viewBox="0 0 24 24"
          width="18"
          height="18"
        >
          <circle cx="12" cy="5" r="2" fill="none" stroke="currentColor" stroke-width="1.8" />
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 7v14m-5-4a5 5 0 0 0 10 0M8 11h8"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8zm6 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"
          />
        </svg>
      </span>
      <span class="row__title">{{ content.title }}</span>
      <span v-if="content.subtitle" class="row__sub"> · {{ content.subtitle }}</span>
    </span>
    <span class="row__when">{{ range }}</span>
    <svg
      class="row__chevron"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 6l6 6-6 6"
      />
    </svg>
  </button>
</template>

<style lang="scss" scoped>
@keyframes rowFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.row {
  appearance: none;
  -webkit-appearance: none;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-left-width: 2px;
  border-radius: $radius-md;
  margin: 0;
  font: inherit;
  outline: none;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $space-3;
  width: 100%;
  padding: 0.7rem 1rem;

  color: inherit;
  text-align: left;
  cursor: pointer;
  font-family: inherit;

  animation: rowFadeIn 200ms ease-out forwards;
  animation-delay: calc(var(--row-index, 0) * 50ms + 300ms);
  opacity: 0;

  transition: transform 150ms ease, border-color 150ms ease, background 150ms ease;

  &:hover {
    transform: translateX(4px);
    background: var(--color-panel-2);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  &--work {
    border-left-color: var(--color-type-work);
    .row__icon { color: var(--color-type-work); }
    &:hover { border-left-color: var(--color-accent); }
  }

  &--edu {
    border-left-color: var(--color-type-edu);
    .row__icon { color: var(--color-type-edu); }
  }

  &--mil {
    border-left-color: var(--color-type-mil);
    .row__icon { color: var(--color-type-mil); }
  }
}

.row__main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-text);
  overflow: hidden;
}

.row__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
}

.row__title {
  font-weight: $fw-bold;
  color: var(--color-text-strong);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

.row__sub {
  color: var(--color-muted);
  font-size: $fs-xs;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.row__when {
  font-family: $font-mono;
  font-size: $fs-sm;
  color: var(--color-muted);
  flex-shrink: 0;
  letter-spacing: 0.02em;
  transition: color 150ms ease;
}

.row__chevron {
  flex-shrink: 0;
  color: var(--color-muted);
  transition: color 150ms ease, transform 150ms ease;
}

.row:hover {
  .row__when { color: var(--color-text); }
  .row__chevron {
    color: var(--color-accent);
    transform: translateX(4px);
  }
}

@media (max-width: 640px) {
  .row {
    padding: 0.55rem 0.75rem;
    gap: 0.5rem;
  }

  .row__sub {
    display: none;
  }

  .row__when {
    font-size: $fs-xs;
  }
}
</style>
