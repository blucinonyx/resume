<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ContentService } from '@/domains/resume/services/ContentService';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';
import { TYPE_ICON_ID, type PeriodSlug, type PeriodMeta } from '@/shared/types/Period';

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

// Localised navigation tooltips (CareerStrip uses its own labels for the
// prev/next chevrons and tab descriptions so we don't have to import them
// from a shared dictionary).
const navLabels = {
  [Lang.EN]: {
    prevWith: (label: string) => `Previous: ${label}`,
    nextWith: (label: string) => `Next: ${label}`,
    prevNone: 'No previous period',
    nextNone: 'No next period',
    tab: (label: string) => `Open ${label}`,
  },
  [Lang.UK]: {
    prevWith: (label: string) => `Попередній: ${label}`,
    nextWith: (label: string) => `Наступний: ${label}`,
    prevNone: 'Більше попередніх немає',
    nextNone: 'Більше наступних немає',
    tab: (label: string) => `Відкрити ${label}`,
  },
} as const;
const nav = computed(() => navLabels[i18n.current]);

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
    <!-- Lucide-style outline icon set, referenced by `<use href="#...">`
         from each tab's pin. Hidden visually but reachable by SVG `<use>`. -->
    <svg class="strip__icons" aria-hidden="true" focusable="false">
      <symbol id="i-briefcase" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M3 13h18" />
      </symbol>
      <symbol id="i-cap" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 10 12 5l10 5-10 5z" />
        <path d="M6 12v5c2.5 2 9.5 2 12 0v-5" />
        <path d="M22 10v6" />
      </symbol>
      <symbol id="i-anchor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="5" r="2.5" />
        <line x1="12" y1="22" x2="12" y2="7.5" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        <line x1="9" y1="11" x2="15" y2="11" />
      </symbol>
    </svg>

    <button
      type="button"
      class="strip__nav strip__nav--prev"
      :disabled="!prev"
      :aria-label="prev ? nav.prevWith(labelFor(prev.slug)) : nav.prevNone"
      :data-tooltip="prev ? nav.prevWith(labelFor(prev.slug)) : nav.prevNone"
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
        :data-tooltip="nav.tab(labelFor(p.slug))"
        :aria-label="nav.tab(labelFor(p.slug))"
        :aria-current="p.slug === props.activeSlug ? 'page' : undefined"
        @click="go(p.slug)"
      >
        <span class="strip__pin">
          <svg aria-hidden="true" focusable="false">
            <use :href="`#${TYPE_ICON_ID[p.type]}`" />
          </svg>
        </span>
        <span class="strip__name">{{ labelFor(p.slug) }}</span>
        <span class="strip__when">{{ ContentService.shortRange(p) }}</span>
      </button>
    </div>

    <button
      type="button"
      class="strip__nav strip__nav--next"
      :disabled="!next"
      :aria-label="next ? nav.nextWith(labelFor(next.slug)) : nav.nextNone"
      :data-tooltip="next ? nav.nextWith(labelFor(next.slug)) : nav.nextNone"
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

  // Note: avoid `transform: scale(...)` on hover here — `transform` creates
  // a new stacking context that traps the tooltip pseudo-element behind
  // child SVG icons. Use background/border for the hover affordance instead.
  &:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: color-mix(in srgb, var(--color-accent) 12%, var(--color-panel-2));
  }

  &:active:not(:disabled) {
    background: color-mix(in srgb, var(--color-accent) 22%, var(--color-panel-2));
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

// Hidden symbol library — `display: none` keeps it out of the layout while
// `<use href="#i-…">` can still pull from it.
.strip__icons {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

// Tab — Bootstrap nav-tabs pattern. Active tab uses border-color trick: the
// bottom border is the SAME colour as the panel below, so it visually erases
// the strip's bottom accent border in its own width.
.strip__tab {
  position: relative;
  display: flex;
  flex-direction: column;
  // Centre the icon + text column so each tab acts as a "station" sitting
  // on the timeline rail (.strip__track::before).
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  min-width: 130px;
  max-width: 180px;
  padding: $space-2 $space-3 calc(#{$space-2} + 2px);
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
  // Round station-marker that sits ON the timeline rail. Panel-coloured
  // background covers the rail behind it so the icon reads cleanly.
  width: 28px;
  height: 28px;
  border-radius: $radius-full;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  color: var(--color-muted);
  transition: border-color 160ms ease, color 160ms ease, box-shadow 160ms ease;

  svg {
    width: 20px;
    height: 20px;
  }

  // Active tab — accent ring + tinted icon, picks up the type colour.
  .strip__tab--active & {
    border-color: var(--strip-tab-accent, var(--color-accent));
    color: var(--strip-tab-accent, var(--color-accent));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--strip-tab-accent, var(--color-accent)) 18%, transparent);
  }

  // Hover on inactive — pin border lifts to the accent (preview cue).
  .strip__tab:hover:not(.strip__tab--active) & {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

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
