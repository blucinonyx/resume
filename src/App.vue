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

<style lang="scss" scoped src="@/shared/styles/AppShell.scss"></style>
