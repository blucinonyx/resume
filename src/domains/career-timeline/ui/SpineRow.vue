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

<style lang="scss" scoped src="@/domains/career-timeline/styles/SpineRow.scss"></style>
