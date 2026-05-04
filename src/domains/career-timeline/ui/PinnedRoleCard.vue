<script setup lang="ts">
import { computed } from 'vue';
import { useLang } from '@/shared/composables/useLang';
import type { PeriodMeta, PeriodContent, PeriodSlug } from '@/shared/types/Period';
import { CareerMapService } from '../services/CareerMapService';

const props = defineProps<{
  meta: PeriodMeta;
  content: PeriodContent;
  range: string;
}>();

const emit = defineEmits<{
  navigate: [slug: PeriodSlug];
}>();

const lang = useLang();
const t = computed(() => lang.value.careerMap);

const highlights = computed(() => CareerMapService.pickHighlights(props.content));

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

<style lang="scss" scoped src="@/domains/career-timeline/styles/PinnedRoleCard.scss"></style>
