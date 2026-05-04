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

// Convert vertical wheel input over the strip into horizontal scroll, so
// users can scroll left/right with a regular mouse wheel and the page
// behind the strip doesn't move when they're aiming at the tabs.
function onWheel(e: WheelEvent): void {
  const el = trackEl.value;
  if (!el) return;
  const dy = e.deltaY;
  const dx = e.deltaX;
  if (Math.abs(dy) <= Math.abs(dx)) return;
  e.preventDefault();
  el.scrollLeft += dy;
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

    <div ref="trackEl" class="strip__track" @wheel="onWheel">
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
  // Bottom accent line — the active tab's panel-coloured bottom border
  // overhangs and "punches through" it in this tab's width.
  border-bottom: 2px solid var(--current-accent, var(--color-border));
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
  height: 36px;
  // Centre vertically inside the grid row so the strip's grid row height
  // is driven by the tab track. If the nav had `margin-bottom`, it would
  // inflate the row and the tabs would not reach the strip's bottom accent
  // line — leaving a visible gap that the active tab's panel-coloured
  // bottom border can't bridge.
  align-self: center;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  color: var(--color-text);
  cursor: pointer;
  transition: all $transition-fast;
  flex-shrink: 0;

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
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
  padding: 2px 2px 0;

  &::-webkit-scrollbar { display: none; }
}

// Tab — Bootstrap nav-tabs pattern. Active tab uses border-color trick: the
// bottom border is the SAME colour as the panel below, so it visually erases
// the strip's bottom accent border in its own width.
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
  // 2px transparent border on all sides — keeps layout stable across states
  border: 2px solid transparent;
  // Overlap the strip's 2px bottom accent border by 2px so the active tab
  // can cover it via its own panel-coloured bottom border (Bootstrap trick).
  margin-bottom: -2px;
  border-radius: $radius-md $radius-md 0 0;
  font-family: $font-mono;
  cursor: pointer;
  scroll-snap-align: center;
  transition: background 160ms ease, border-color 160ms ease;

  // Vertical separator — only on inactive tabs that follow another inactive
  & + & {
    border-left: 1px solid var(--color-border);
  }

  &:hover:not(.strip__tab--active) {
    border-color: color-mix(in srgb, var(--color-border) 70%, transparent);
    background: color-mix(in srgb, var(--color-panel-2) 60%, transparent);
  }

  // Active — wrap-around in type accent on TOP + LEFT + RIGHT. The bottom
  // border is panel-coloured AND 3px tall (1px wider than the strip's 2px
  // accent line) with a matching margin-bottom: -3px, so the active tab's
  // bottom edge physically sits below the strip's underline and erases it
  // in this tab's width. Pops 3px up.
  &--active {
    z-index: 3;
    margin-top: -3px;
    margin-bottom: -3px;
    padding-top: calc(#{$space-2} + 3px);
    background: var(--color-panel);
    border-color: var(--strip-tab-accent, var(--color-accent));
    border-bottom: 3px solid var(--color-panel);
    box-shadow: 0 -3px 14px color-mix(in srgb, var(--strip-tab-accent, var(--color-accent)) 18%, transparent);
  }

  // Override the inactive-tab grey separator when the next tab is active —
  // the active tab's left border must be the accent colour, not grey.
  & + &--active {
    border-left: 2px solid var(--strip-tab-accent, var(--color-accent));
  }

  // Per-type accent on active tab
  &--active.strip__tab--work { --strip-tab-accent: var(--color-type-work); }
  &--active.strip__tab--edu  { --strip-tab-accent: var(--color-type-edu); }
  &--active.strip__tab--mil  { --strip-tab-accent: var(--color-type-mil); }
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
