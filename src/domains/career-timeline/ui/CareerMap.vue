<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { ContentService } from '@/domains/resume/services/ContentService';
import { Lang } from '@/shared/types/Lang';
import type { PeriodMeta, PeriodSlug, PeriodContent } from '@/shared/types/Period';
import PinnedRoleCard from './PinnedRoleCard.vue';
import SpineRow from './SpineRow.vue';

const router = useRouter();
const i18n = useI18nStore();

const allPeriods = computed<PeriodMeta[]>(() => [...ContentService.all()].reverse());

const pinned = computed<PeriodMeta | undefined>(
  () => allPeriods.value.find((p) => p.current) ?? allPeriods.value[0],
);

const rest = computed<PeriodMeta[]>(() => {
  const current = pinned.value;
  return current
    ? allPeriods.value.filter((p) => p.slug !== current.slug)
    : allPeriods.value;
});

const yearRange = computed<string>(() => {
  if (rest.value.length === 0) return '';
  const earliest = Math.min(...rest.value.map((p) => p.startYear));
  const latest = Math.max(...rest.value.map((p) => p.endYear ?? p.startYear));
  return `${earliest} — ${latest}`;
});

const labels = {
  [Lang.EN]: {
    headline: 'Senior Full-Stack · Laravel + Vue · 10+ years · Tech Lead',
    previous: '// previous',
  },
  [Lang.UK]: {
    headline: 'Senior Full-Stack · Laravel + Vue · 10+ років · Tech Lead',
    previous: '// раніше',
  },
} as const;

const t = computed(() => labels[i18n.current]);

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

<style lang="scss" scoped>
.map {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  padding: $space-5 0 $space-7;
  max-width: 720px;
  margin: 0 auto;
}

.map__intro {
  text-align: center;
  margin-bottom: $space-2;
}

.map__headline {
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  margin: 0;
}

.map__separator {
  text-align: center;
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--color-muted);
  letter-spacing: 0.1em;
  margin: $space-4 0 $space-2;
}

.map__list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  list-style: none;
  padding: 0;
  margin: 0;
}

.map__item {
  margin: 0;
}

@media (max-width: 640px) {
  .map {
    padding: $space-4 $space-3 $space-6;
  }
}
</style>
