<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';
import { PeriodSlug } from '@/shared/types/Period';

interface Project {
  client: string;
  stack: string;
  blurb: string;
  hue: number;
  rotate: number;
}

const route = useRoute();
const i18n = useI18nStore();

const variant = computed<'early' | 'late'>(() => {
  const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;
  return slug === PeriodSlug.FreelanceLate ? 'late' : 'early';
});

const PROJECTS_EARLY: Project[] = [
  { client: 'Local sportshop', stack: 'PHP · jQuery · MySQL', blurb: 'small e-commerce + admin', hue: 200, rotate: -2 },
  { client: 'Auto-parts micro-site', stack: 'WordPress + custom', blurb: 'catalogue + filters', hue: 30, rotate: 1.5 },
  { client: 'Real-estate calc', stack: 'VB6 → web port', blurb: 'area + price calculator', hue: 280, rotate: -1 },
  { client: 'Restaurant menu', stack: 'HTML/CSS · vanilla JS', blurb: 'static menu + booking form', hue: 150, rotate: 2 },
  { client: 'Event landing', stack: 'Bootstrap · PHP forms', blurb: '3-page event landing', hue: 320, rotate: -2 },
];

const PROJECTS_LATE: Project[] = [
  { client: 'Logistics dashboard', stack: 'Laravel · Vue 2', blurb: 'fleet + tracking dash', hue: 200, rotate: -1.5 },
  { client: 'Crypto wallet UI', stack: 'Vue · vanilla CSS', blurb: 'wallet UI proof-of-concept', hue: 280, rotate: 2 },
  { client: 'CRM sync', stack: 'Laravel · API client', blurb: 'CRM ↔ ERP sync layer', hue: 50, rotate: -1 },
  { client: 'Booking widget', stack: 'JS · PHP backend', blurb: 'reusable booking widget', hue: 150, rotate: 1.5 },
];

const projects = computed(() =>
  variant.value === 'late' ? PROJECTS_LATE : PROJECTS_EARLY,
);

const labels = {
  [Lang.EN]: {
    titleEarly: 'Freelance projects · 2014—2016',
    titleLate: 'Freelance projects · 2018',
    note: 'Side-projects from this stretch — small clients, short cycles. The variety is what taught me to set up a project from scratch end-to-end.',
  },
  [Lang.UK]: {
    titleEarly: 'Фриланс-проекти · 2014—2016',
    titleLate: 'Фриланс-проекти · 2018',
    note: 'Сайд-проекти за цей період — малі клієнти, короткі цикли. Різноманіття навчило підіймати проект з нуля до кінця.',
  },
} as const;
const t = computed(() => labels[i18n.current]);

const title = computed(() => (variant.value === 'late' ? t.value.titleLate : t.value.titleEarly));
</script>

<template>
  <div class="board">
    <header class="board__head">
      <span class="board__title">{{ title }}</span>
    </header>

    <div class="board__corkboard">
      <article
        v-for="(p, i) in projects"
        :key="i"
        class="board__note"
        :style="{
          background: `linear-gradient(135deg, hsl(${p.hue}, 65%, 75%), hsl(${p.hue}, 60%, 65%))`,
          transform: `rotate(${p.rotate}deg)`,
        }"
      >
        <span class="board__pin" aria-hidden="true" />
        <span class="board__note-client">{{ p.client }}</span>
        <span class="board__note-stack">{{ p.stack }}</span>
        <span class="board__note-blurb">{{ p.blurb }}</span>
      </article>
    </div>

    <p class="board__note-text">{{ t.note }}</p>
  </div>
</template>

<style lang="scss" scoped src="@/shared/styles/period-visuals/ProjectBoard.scss"></style>
