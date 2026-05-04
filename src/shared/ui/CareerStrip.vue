<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ContentService } from '@/domains/resume/services/ContentService';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { useLang } from '@/shared/composables/useLang';
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

const lang = useLang();
const nav = computed(() => lang.value.careerStrip);

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

<style lang="scss" scoped src="@/shared/styles/CareerStrip.scss"></style>
