<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ContentService } from '@/domains/resume/services/ContentService';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { TYPE_ICON, type PeriodSlug, type PeriodMeta } from '@/shared/types/Period';

interface Props {
  activeSlug?: PeriodSlug | null;
}

const props = withDefaults(defineProps<Props>(), {
  activeSlug: null,
});

const router = useRouter();
const i18n = useI18nStore();

const periods = computed<readonly PeriodMeta[]>(() => ContentService.all());
const trackEl = ref<HTMLElement | null>(null);

const activeIndex = computed<number>(() => {
  if (!props.activeSlug) return -1;
  return periods.value.findIndex((p) => p.slug === props.activeSlug);
});

const prev = computed<PeriodMeta | null>(() => {
  if (activeIndex.value <= 0) return null;
  return periods.value[activeIndex.value - 1];
});

const next = computed<PeriodMeta | null>(() => {
  const i = activeIndex.value;
  if (i < 0 || i >= periods.value.length - 1) return null;
  return periods.value[i + 1];
});

function go(slug: PeriodSlug): void {
  router.push({ name: 'period', params: { slug } });
}

function labelFor(slug: PeriodSlug): string {
  return ContentService.content(slug, i18n.current)?.title ?? slug;
}

watch(
  () => props.activeSlug,
  async (slug) => {
    if (!slug) return;
    await nextTick();
    const node = trackEl.value?.querySelector<HTMLElement>(`[data-slug="${slug}"]`);
    node?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  },
  { immediate: true },
);
</script>

<template>
  <nav class="strip" aria-label="Career timeline">
    <button
      type="button"
      class="strip__nav strip__nav--prev"
      :disabled="!prev"
      :aria-label="prev ? `Previous: ${labelFor(prev.slug)}` : 'No previous period'"
      :title="prev ? labelFor(prev.slug) : ''"
      @click="prev && go(prev.slug)"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 6 L9 12 L15 18"
        />
      </svg>
    </button>

    <div ref="trackEl" class="strip__track">
      <button
        v-for="p in periods"
        :key="p.slug"
        type="button"
        class="strip__tab"
        :class="[
          `strip__tab--${p.type}`,
          {
            'strip__tab--active': p.slug === props.activeSlug,
            'strip__tab--current': p.current,
          },
        ]"
        :data-slug="p.slug"
        :title="labelFor(p.slug)"
        :aria-current="p.slug === props.activeSlug ? 'page' : undefined"
        @click="go(p.slug)"
      >
        <span class="strip__pin">{{ TYPE_ICON[p.type] }}</span>
        <span class="strip__name">{{ labelFor(p.slug) }}</span>
        <span class="strip__when">{{ ContentService.shortRange(p) }}</span>
      </button>
    </div>

    <button
      type="button"
      class="strip__nav strip__nav--next"
      :disabled="!next"
      :aria-label="next ? `Next: ${labelFor(next.slug)}` : 'No next period'"
      :title="next ? labelFor(next.slug) : ''"
      @click="next && go(next.slug)"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 6 L15 12 L9 18"
        />
      </svg>
    </button>

  </nav>
</template>

<style lang="scss" scoped>
.strip {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: stretch;
  gap: $space-2;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  // Bootstrap nav-tabs style: a 1px horizontal line at the bottom of the
  // strip; the active tab's own bottom border (panel-coloured) "punches
  // through" this line in its own width — no JS / no bridge element needed.
  border-bottom: 1px solid var(--color-border);
  border-radius: $radius-lg $radius-lg 0 0;
  padding: $space-2 $space-2 0;
  position: relative;
  z-index: 2;
}

.strip__nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  color: var(--color-text);
  cursor: pointer;
  transition: all $transition-fast;
  flex-shrink: 0;
  // Symmetric vertical breathing room — same gap to the strip's bottom edge
  // as to the top.
  margin-bottom: $space-2;

  &:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.strip__track {
  display: flex;
  gap: 0;
  // Allow horizontal scroll for overflow tabs while keeping the active tab's
  // ::after bridge able to render BELOW the track (overflow-y: visible).
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
  padding: 2px 2px 0;

  &::-webkit-scrollbar { display: none; }
}

// Tab — classic Bootstrap nav-tabs. Inactive tabs are flat & transparent;
// active tab gets a 1px grey wrap-around border (top/left/right) and its
// bottom border is panel-coloured so it visually erases the strip's bottom
// line in its own width — connecting the tab to the panel below.
.strip__tab {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  flex-shrink: 0;
  min-width: 120px;
  max-width: 180px;
  padding: $space-2 $space-3;
  background: transparent;
  // 1px transparent border on all sides — keeps layout stable across states
  border: 1px solid transparent;
  // Overlap the strip's 1px bottom border so the active tab can cover it
  // via its own panel-coloured bottom border (Bootstrap trick).
  margin-bottom: -1px;
  border-radius: $radius-md $radius-md 0 0;
  font-family: $font-mono;
  cursor: pointer;
  scroll-snap-align: center;
  transition: background 160ms ease, border-color 160ms ease;

  &:hover:not(.strip__tab--active) {
    border-color: color-mix(in srgb, var(--color-border) 70%, transparent);
    background: color-mix(in srgb, var(--color-panel-2) 60%, transparent);
  }

  // Active — flat Bootstrap style: same grey border as everything else on
  // top + left + right; bottom border = panel colour to seam with the
  // content panel below. No lift, no shadow, no per-type accent on borders.
  &--active {
    z-index: 3;
    background: var(--color-panel);
    border-color: var(--color-border) var(--color-border) var(--color-panel);
  }
}

.strip__pin {
  font-size: $fs-sm;
  line-height: 1;

  // Subtle ring around current (Keyapp) — but not the active highlight
  .strip__tab--current:not(.strip__tab--active) & {
    filter: drop-shadow(0 0 4px var(--color-accent));
  }
}

.strip__name {
  font-family: $font-mono;
  font-size: $fs-xs;
  font-weight: $fw-bold;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  .strip__tab--active & {
    color: var(--color-text-strong);
  }
  .strip__tab--active.strip__tab--work & { color: var(--color-type-work); }
  .strip__tab--active.strip__tab--edu & { color: var(--color-type-edu); }
  .strip__tab--active.strip__tab--mil & { color: var(--color-type-mil); }
}

.strip__when {
  font-family: $font-mono;
  font-size: 0.62rem;
  color: var(--color-muted);
  letter-spacing: 0.02em;
  white-space: nowrap;
}

</style>
