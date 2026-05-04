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

<style lang="scss" scoped>
.board {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
}

.board__head {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
}

.board__title {
  font-size: $fs-xs;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.board__corkboard {
  background:
    repeating-linear-gradient(45deg, rgba(160, 110, 50, 0.05), rgba(160, 110, 50, 0.05) 4px, transparent 4px, transparent 9px),
    color-mix(in srgb, var(--color-warning) 25%, var(--color-panel-2));
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  padding: $space-5 $space-4;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: $space-4;
  min-height: 240px;
}

.board__note {
  position: relative;
  padding: $space-4 $space-3 $space-3;
  border-radius: 2px;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.25),
    0 1px 2px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #1a1a1a;
  min-height: 110px;
  transition: transform $transition-fast;

  &:hover {
    transform: rotate(0deg) scale(1.04) !important;
    z-index: 2;
  }
}

.board__pin {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.board__note-client {
  font-size: 0.78rem;
  font-weight: $fw-bold;
}

.board__note-stack {
  font-size: 0.62rem;
  font-family: $font-mono;
  color: rgba(0, 0, 0, 0.65);
}

.board__note-blurb {
  font-size: 0.68rem;
  color: rgba(0, 0, 0, 0.85);
  margin-top: 4px;
  line-height: 1.35;
}

.board__note-text {
  margin: 0;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  line-height: 1.5;
}
</style>
