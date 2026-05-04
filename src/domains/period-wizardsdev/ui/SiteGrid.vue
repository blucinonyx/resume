<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLang } from '@/shared/composables/useLang';
import type { Site } from '../interface/SiteTypes';

const SITES: readonly Site[] = Object.freeze([
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
]);

const lang = useLang();
const t = computed(() => lang.value.periods.wizardsdev);

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

<style lang="scss" scoped src="@/domains/period-wizardsdev/styles/SiteGrid.scss"></style>
