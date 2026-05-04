<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/shared/ui/AppHeader.vue';
import CareerStrip from '@/shared/ui/CareerStrip.vue';
import { ContentService } from '@/domains/resume/services/ContentService';
import { PeriodSlug, PeriodType } from '@/shared/types/Period';

const route = useRoute();

const periodSlug = computed<PeriodSlug | null>(() => {
  if (route.name !== 'period') return null;
  const raw = route.params.slug;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  return Object.values(PeriodSlug).includes(value as PeriodSlug)
    ? (value as PeriodSlug)
    : null;
});

// CSS-variable colour for the route-wrap top border, reflecting the active
// period's type. Lives in App so the route content can fade independently.
const currentAccent = computed<string | null>(() => {
  if (!periodSlug.value) return null;
  const meta = ContentService.meta(periodSlug.value);
  if (!meta) return null;
  if (meta.type === PeriodType.Education) return 'var(--color-type-edu)';
  if (meta.type === PeriodType.Military) return 'var(--color-type-mil)';
  return 'var(--color-type-work)';
});
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="app__main">
      <CareerStrip
        v-if="periodSlug"
        :active-slug="periodSlug"
        class="app__strip"
        :style="currentAccent ? { '--current-accent': currentAccent } : undefined"
      />
      <div class="app__route-wrap">
        <RouterView v-slot="{ Component, route: r }">
          <Transition name="page">
            <component :is="Component" :key="r.fullPath" />
          </Transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app__main {
  flex: 1;
  width: 100%;
  max-width: $container-default;
  margin: 0 auto;
  padding: $space-5 $space-5 $space-8;
  display: flex;
  flex-direction: column;

  @media (max-width: $bp-tablet) {
    padding: $space-4;
  }
}

// CareerStrip sits flush against the role panel below — they read as one card.
.app__strip {
  margin-bottom: 0;
}

// Wrapper around RouterView — gives the leaving page somewhere to absolute-pos
// itself during the crossfade transition. The accent line lives on the strip
// itself (border-bottom) and is "punched through" by the active tab.
.app__route-wrap {
  position: relative;
  flex: 1;
}
</style>

<style lang="scss">
// Page transition — concise crossfade between period pages.
// Both old and new render at once (mode="default") so there is no blank gap.
// Strip stays mounted in App.vue, so the active-tab indicator transitions
// independently and never blinks.
.page-enter-active {
  transition: opacity 220ms cubic-bezier(0.22, 0.61, 0.36, 1) 60ms;
}
.page-leave-active {
  transition: opacity 160ms ease-out;
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.page-enter-from {
  opacity: 0;
}
.page-leave-to {
  opacity: 0;
}
</style>
