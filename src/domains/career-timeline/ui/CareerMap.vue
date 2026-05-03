<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { ContentService } from '@/domains/resume/services/ContentService';
import { Lang } from '@/shared/types/Lang';
import { TYPE_ICON, type PeriodSlug } from '@/shared/types/Period';

const router = useRouter();
const i18n = useI18nStore();

const periods = computed(() => [...ContentService.all()].reverse()); // newest first

const labels = {
  [Lang.EN]: {
    h1: 'Olexander Shmakov',
    sub: 'Senior Full-Stack · Laravel + Vue · 10+ years · Tech Lead',
    hl: 'Scaled ClickHouse 1M → 124M rows/day · ~20 TB daily traffic',
    pickHint: 'Pick any period to dive in',
  },
  [Lang.UK]: {
    h1: 'Олександр Шмаков',
    sub: 'Senior Full-Stack · Laravel + Vue · 10+ років · Tech Lead',
    hl: 'Масштабував ClickHouse 1М → 124М рядків/добу · ~20 ТБ трафіку щодня',
    pickHint: 'Обери будь-який період щоб зануритися',
  },
} as const;

const t = computed(() => labels[i18n.current]);

function go(slug: PeriodSlug): void {
  router.push({ name: 'period', params: { slug } });
}

function titleOf(slug: PeriodSlug): string {
  return ContentService.content(slug, i18n.current)?.title ?? slug;
}

function subtitleOf(slug: PeriodSlug): string {
  return ContentService.content(slug, i18n.current)?.subtitle ?? '';
}
</script>

<template>
  <div class="map">
    <header class="map__hero">
      <h1 class="map__h1">{{ t.h1 }}</h1>
      <p class="map__sub">{{ t.sub }}</p>
      <p class="map__hl">{{ t.hl }}</p>
    </header>

    <p class="map__hint">{{ t.pickHint }} ↓</p>

    <ol class="map__grid">
      <li
        v-for="p in periods"
        :key="p.slug"
        class="map__cell"
        :class="[`map__cell--${p.type}`, { 'map__cell--current': p.current }]"
      >
        <button type="button" class="map__btn" @click="go(p.slug)">
          <span class="map__pin">{{ TYPE_ICON[p.type] }}</span>
          <span class="map__cell-body">
            <span class="map__cell-title">{{ titleOf(p.slug) }}</span>
            <span class="map__cell-sub">{{ subtitleOf(p.slug) }}</span>
            <span class="map__cell-when">{{ ContentService.formatRange(p, i18n.current) }}</span>
          </span>
          <span class="map__arrow" aria-hidden="true">→</span>
        </button>
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.map {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-5 0;
}

.map__hero {
  text-align: center;
  padding: $space-6 $space-4 $space-4;
}

.map__h1 {
  font-size: $fs-2xl;
  font-weight: $fw-black;
  margin: 0 0 $space-2;
  letter-spacing: -0.02em;
  color: var(--color-text-strong);
}

.map__sub {
  color: var(--color-muted);
  font-size: $fs-base;
  margin: 0 0 $space-3;
}

.map__hl {
  color: var(--color-accent);
  font-family: $font-mono;
  font-size: $fs-sm;
  margin: 0;
}

.map__hint {
  text-align: center;
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--color-accent);
  margin: 0;
}

.map__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $space-3;
  margin: 0;
  padding: 0;
  list-style: none;
}

.map__cell {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  transition:
    transform $transition-fast,
    border-color $transition-fast,
    box-shadow $transition-fast;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-card);
  }

  &--work:hover {
    border-color: var(--color-type-work);
  }
  &--edu:hover {
    border-color: var(--color-type-edu);
  }
  &--mil:hover {
    border-color: var(--color-type-mil);
  }

  &--current {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 1px var(--color-accent);
  }
}

.map__btn {
  display: flex;
  align-items: center;
  gap: $space-3;
  width: 100%;
  padding: $space-4;
  background: transparent;
  border: 0;
  text-align: left;
  color: inherit;
}

.map__pin {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: $radius-full;
  font-size: $fs-md;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  flex-shrink: 0;

  .map__cell--work & {
    border-color: var(--color-type-work);
  }
  .map__cell--edu & {
    border-color: var(--color-type-edu);
  }
  .map__cell--mil & {
    border-color: var(--color-type-mil);
  }
  .map__cell--current & {
    background: var(--color-accent);
    border-color: var(--color-accent);
    box-shadow: var(--glow-accent);
  }
}

.map__cell-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.map__cell-title {
  font-weight: $fw-bold;
  font-size: $fs-sm;
  color: var(--color-text-strong);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.map__cell-sub {
  font-size: $fs-xs;
  color: var(--color-muted);
  font-family: $font-mono;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.map__cell-when {
  font-size: 0.65rem;
  color: var(--color-muted);
  font-family: $font-mono;
  margin-top: 2px;
}

.map__arrow {
  font-family: $font-mono;
  color: var(--color-muted);
  font-size: $fs-md;
  transition: transform $transition-fast, color $transition-fast;

  .map__cell:hover & {
    transform: translateX(4px);
    color: var(--color-accent);
  }
}
</style>
