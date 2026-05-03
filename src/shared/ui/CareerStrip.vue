<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ContentService } from '@/domains/resume/services/ContentService';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { TYPE_ICON, type PeriodSlug } from '@/shared/types/Period';

interface Props {
  activeSlug?: PeriodSlug | null;
}

const props = withDefaults(defineProps<Props>(), {
  activeSlug: null,
});

const router = useRouter();
const i18n = useI18nStore();

const periods = computed(() => ContentService.all());

function go(slug: PeriodSlug): void {
  router.push({ name: 'period', params: { slug } });
}

function labelFor(slug: PeriodSlug): string {
  return ContentService.content(slug, i18n.current)?.title ?? slug;
}
</script>

<template>
  <div class="strip" role="navigation" aria-label="Career timeline">
    <div class="strip__track">
      <div class="strip__line" aria-hidden="true" />
      <button
        v-for="p in periods"
        :key="p.slug"
        type="button"
        class="strip__node"
        :class="[
          `strip__node--${p.type}`,
          { 'strip__node--active': p.slug === props.activeSlug, 'strip__node--current': p.current },
        ]"
        :title="labelFor(p.slug)"
        @click="go(p.slug)"
      >
        <span class="strip__pin">{{ TYPE_ICON[p.type] }}</span>
        <span class="strip__name">{{ labelFor(p.slug) }}</span>
        <span class="strip__when">{{ ContentService.shortRange(p) }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.strip {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  padding: $space-4 $space-5 $space-3;
  overflow-x: auto;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-border-strong);
    border-radius: $radius-full;
  }
}

.strip__track {
  position: relative;
  display: flex;
  gap: $space-3;
  min-width: max-content;
  padding: $space-4 $space-2 $space-3;
}

.strip__line {
  position: absolute;
  top: calc(#{$space-4} + 14px);
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-border);
  z-index: 0;
}

.strip__node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
  padding: 0 $space-2;
  min-width: 92px;
  background: transparent;
  border: 0;
  cursor: pointer;
  transition: transform $transition-fast;
  z-index: 1;

  &:hover {
    transform: translateY(-3px);
  }
}

.strip__pin {
  width: 28px;
  height: 28px;
  border-radius: $radius-full;
  background: var(--color-panel);
  border: 2px solid var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $fs-sm;
  transition: all $transition-fast;

  .strip__node--work & {
    border-color: var(--color-type-work);
  }
  .strip__node--edu & {
    border-color: var(--color-type-edu);
  }
  .strip__node--mil & {
    border-color: var(--color-type-mil);
  }

  .strip__node--active &,
  .strip__node--current & {
    background: var(--color-accent);
    border-color: var(--color-accent);
    box-shadow: var(--glow-accent);
  }

  .strip__node--active.strip__node--edu &,
  .strip__node--current.strip__node--edu & {
    background: var(--color-magenta);
    border-color: var(--color-magenta);
    box-shadow: var(--glow-magenta);
  }

  .strip__node--active.strip__node--mil &,
  .strip__node--current.strip__node--mil & {
    background: var(--color-warning);
    border-color: var(--color-warning);
    box-shadow: var(--glow-warning);
  }
}

.strip__name {
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--color-text);
  white-space: nowrap;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;

  .strip__node--active &,
  .strip__node--current & {
    font-weight: $fw-bold;
    color: var(--color-accent);
  }
  .strip__node--active.strip__node--edu &,
  .strip__node--current.strip__node--edu & {
    color: var(--color-magenta);
  }
  .strip__node--active.strip__node--mil &,
  .strip__node--current.strip__node--mil & {
    color: var(--color-warning);
  }
}

.strip__when {
  color: var(--color-muted);
  font-size: 0.65rem;
  font-family: $font-mono;
  white-space: nowrap;
}
</style>
