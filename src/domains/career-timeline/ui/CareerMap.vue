<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { ContentService } from '@/domains/resume/services/ContentService';
import { useLang } from '@/shared/composables/useLang';
import type { PeriodMeta, PeriodSlug, PeriodContent } from '@/shared/types/Period';
import PinnedRoleCard from './PinnedRoleCard.vue';
import SpineRow from './SpineRow.vue';
import { CareerMapService } from '../services/CareerMapService';

const router = useRouter();
const i18n = useI18nStore();
const lang = useLang();
const t = computed(() => lang.value.careerMap);

const allPeriods = computed<PeriodMeta[]>(() => [...ContentService.all()].reverse());
const split = computed(() => CareerMapService.splitByPin(allPeriods.value));
const pinned = computed(() => split.value.pinned);
const rest = computed(() => split.value.rest);
const yearRange = computed(() => CareerMapService.yearRange(rest.value));

function go(slug: PeriodSlug): void {
  router.push({ name: 'period', params: { slug } });
}

function rangeOf(p: PeriodMeta): string {
  return ContentService.formatRange(p, i18n.current);
}

function contentOf(p: PeriodMeta): PeriodContent {
  const c = ContentService.content(p.slug, i18n.current);
  if (!c) throw new Error(`No content for slug ${p.slug} in lang ${i18n.current}`);
  return c;
}
</script>

<template>
  <div class="map">
    <header class="map__intro">
      <p class="map__headline">{{ t.headline }}</p>
    </header>

    <PinnedRoleCard
      v-if="pinned"
      :meta="pinned"
      :content="contentOf(pinned)"
      :range="rangeOf(pinned)"
      @navigate="go"
    />

    <p v-if="rest.length" class="map__separator">{{ t.previous }} · {{ yearRange }}</p>

    <ol class="map__list">
      <li v-for="(p, i) in rest" :key="p.slug" class="map__item">
        <SpineRow
          :meta="p"
          :content="contentOf(p)"
          :range="rangeOf(p)"
          :index="i"
          @navigate="go"
        />
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped src="@/domains/career-timeline/styles/CareerMap.scss"></style>
