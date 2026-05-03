<script setup lang="ts">
import { computed } from 'vue';
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

const typeIcon = computed((): string => {
  if (props.meta.type === PeriodType.Education) return '🎓';
  if (props.meta.type === PeriodType.Military) return '⚓';
  return '';
});

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
      <span v-if="typeIcon" class="row__icon">{{ typeIcon }}</span>
      <span class="row__title">{{ content.title }}</span>
      <span v-if="content.subtitle" class="row__sub"> · {{ content.subtitle }}</span>
    </span>
    <span class="row__when">{{ range }}<span aria-hidden="true"> →</span></span>
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
  // Reset button defaults
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  outline: none;

  // Layout
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.65rem 0.9rem;
  margin: 0;

  // Visual
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-left-width: 2px;
  border-radius: $radius-md;

  // Text
  color: inherit;
  text-align: left;
  cursor: pointer;
  font-family: inherit;

  // Animation
  animation: rowFadeIn 200ms ease-out forwards;
  animation-delay: calc(var(--row-index, 0) * 50ms + 300ms);
  opacity: 0;

  // Interaction
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

    &:hover {
      border-left-color: var(--color-accent);
    }
  }

  &--edu {
    border-left-color: var(--color-type-edu);
  }

  &--mil {
    border-left-color: var(--color-type-mil);
  }
}

.row__main {
  flex: 1;
  min-width: 0;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row__icon {
  margin-right: 0.4rem;
}

.row__title {
  font-weight: $fw-bold;
  color: var(--color-text-strong);
}

.row__sub {
  color: var(--color-muted);
  font-size: $fs-xs;
}

.row__when {
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--color-muted);
  margin-left: 0.75rem;
  flex-shrink: 0;
  transition: color 150ms ease, transform 150ms ease;
}

.row:hover .row__when {
  color: var(--color-accent);
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .row {
    padding: 0.5rem 0.75rem;
  }

  .row__sub {
    display: none;
  }
}
</style>
