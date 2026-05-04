<script setup lang="ts">
import { computed } from 'vue';
import { useLang } from '@/shared/composables/useLang';
import { FormatService } from '@/shared/utils/format';

const lang = useLang();
const t = computed(() => lang.value.periods.goit);
</script>

<template>
  <div class="tree">
    <header class="tree__head">
      <span class="tree__title">{{ t.title }}</span>
      <div class="tree__legend">
        <span class="tree__leg tree__leg--on"><span class="tree__dot tree__dot--on" />{{ t.legendUnlocked }}</span>
      </div>
    </header>

    <ol class="tree__nodes">
      <li
        v-for="(n, i) in t.nodes"
        :key="n.key"
        class="tree__node tree__node--on"
      >
        <span class="tree__order">{{ FormatService.stepNumber(i) }}</span>
        <span class="tree__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 12l5 5L20 7"
            />
          </svg>
        </span>
        <span class="tree__label">{{ n.label }}</span>
      </li>
    </ol>

    <p class="tree__note">{{ t.note }}</p>
  </div>
</template>

<style lang="scss" scoped src="@/domains/period-goit/styles/SkillTree.scss"></style>
