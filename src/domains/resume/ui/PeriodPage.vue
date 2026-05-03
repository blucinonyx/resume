<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RoleLayout from '@/shared/ui/RoleLayout.vue';
import { ContentService } from '../services/ContentService';
import { PeriodSlug } from '@/shared/types/Period';

const route = useRoute();
const router = useRouter();

const slug = computed<PeriodSlug | null>(() => {
  const raw = route.params.slug;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  if (Object.values(PeriodSlug).includes(value as PeriodSlug)) {
    return value as PeriodSlug;
  }
  return null;
});

if (!slug.value || !ContentService.meta(slug.value)) {
  router.replace({ name: 'home' });
}

// Custom visuals per period (lazy-loaded). Periods without an entry use the default placeholder.
const VISUAL_BY_SLUG: Partial<Record<PeriodSlug, ReturnType<typeof defineAsyncComponent>>> = {
  [PeriodSlug.Keyapp]: defineAsyncComponent(
    () => import('@/domains/period-keyapp/ui/PipelineSimulator.vue'),
  ),
};

const visual = computed(() => (slug.value ? VISUAL_BY_SLUG[slug.value] ?? null : null));
</script>

<template>
  <RoleLayout v-if="slug" :slug="slug">
    <template v-if="visual" #visual>
      <component :is="visual" />
    </template>
  </RoleLayout>
</template>
