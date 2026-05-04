<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';

interface Site {
  name: string;
  category: string;
  hue: number;
}

const SITES: Site[] = [
  { name: 'fxtraderpro', category: 'forex', hue: 200 },
  { name: 'globalmarkets', category: 'forex', hue: 220 },
  { name: 'cryptostake', category: 'crypto', hue: 280 },
  { name: 'bnk-vision', category: 'banking', hue: 160 },
  { name: 'optionswire', category: 'options', hue: 30 },
  { name: 'dailypip', category: 'forex', hue: 240 },
  { name: 'commodity24', category: 'commodities', hue: 50 },
  { name: 'forexlens', category: 'forex', hue: 190 },
  { name: 'pivot.fund', category: 'fund', hue: 320 },
  { name: 'rate-radar', category: 'rates', hue: 100 },
];

const i18n = useI18nStore();

const labels = {
  [Lang.EN]: {
    title: 'Forex / finance landing pages · WordPress + custom plugins',
    sites: 'sites shipped',
    months: 'months',
    note: '~10 sites in 3 months — frontend-team support: WP themes, PHP plugins, frontend widgets. Hover a tile for stack.',
    stack: 'PHP · JS · HTML · SQL · WordPress',
  },
  [Lang.UK]: {
    title: 'Forex / finance лендінги · WordPress + кастомні плагіни',
    sites: 'сайтів',
    months: 'місяців',
    note: '~10 сайтів за 3 місяці — підтримка фронт-команди: WP-теми, PHP-плагіни, фронт-віджети. Наведи на тайл для стека.',
    stack: 'PHP · JS · HTML · SQL · WordPress',
  },
} as const;
const t = computed(() => labels[i18n.current]);

const hovered = ref<string | null>(null);
</script>

<template>
  <div class="grid">
    <header class="grid__head">
      <span class="grid__title">{{ t.title }}</span>
      <div class="grid__counts">
        <span><strong>{{ SITES.length }}</strong> {{ t.sites }}</span>
        <span><strong>3</strong> {{ t.months }}</span>
      </div>
    </header>

    <ul class="grid__items">
      <li
        v-for="s in SITES"
        :key="s.name"
        class="grid__item"
        @mouseenter="hovered = s.name"
        @mouseleave="hovered = null"
      >
        <div
          class="grid__tile"
          :style="{
            background: `linear-gradient(135deg, hsl(${s.hue}, 70%, 35%), hsl(${s.hue}, 60%, 18%))`,
          }"
        >
          <span class="grid__tile-bar" />
          <span class="grid__tile-name">{{ s.name }}.com</span>
          <span class="grid__tile-cat">{{ s.category }}</span>
        </div>
        <span v-if="hovered === s.name" class="grid__overlay">{{ t.stack }}</span>
      </li>
    </ul>

    <p class="grid__note">{{ t.note }}</p>
  </div>
</template>

<style lang="scss" scoped>
.grid {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
}

.grid__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
  flex-wrap: wrap;
  gap: $space-2;
}

.grid__title {
  font-size: $fs-xs;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.grid__counts {
  display: flex;
  gap: $space-3;
  font-size: $fs-xs;
  color: var(--color-muted);

  strong {
    color: var(--color-success);
    font-weight: $fw-bold;
    margin-right: 2px;
  }
}

.grid__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: $space-2;
}

.grid__item {
  position: relative;
  cursor: default;
}

.grid__tile {
  border-radius: $radius-md;
  padding: $space-2 $space-3;
  height: 78px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  transition: transform $transition-fast, box-shadow $transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.15), transparent 50%);
  }
}

.grid__tile-bar {
  height: 4px;
  width: 60%;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
}

.grid__tile-name {
  font-size: 0.75rem;
  font-weight: $fw-bold;
  letter-spacing: 0.02em;
}

.grid__tile-cat {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.75;
}

.grid__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--color-bg) 90%, transparent);
  border: 1px solid var(--color-accent);
  border-radius: $radius-md;
  color: var(--color-accent);
  font-size: 0.65rem;
  text-align: center;
  padding: $space-2;
  pointer-events: none;
}

.grid__note {
  margin: 0;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  line-height: 1.5;
}
</style>
