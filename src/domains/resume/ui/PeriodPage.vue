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
  [PeriodSlug.Xpay]: defineAsyncComponent(
    () => import('@/domains/period-xpay/ui/PaymentConsole.vue'),
  ),
  [PeriodSlug.KoshelOk]: defineAsyncComponent(
    () => import('@/domains/period-koshelok/ui/WalletCard.vue'),
  ),
  [PeriodSlug.MedService]: defineAsyncComponent(
    () => import('@/domains/period-medservice/ui/PageSpeedDash.vue'),
  ),
  [PeriodSlug.Karbosnab]: defineAsyncComponent(
    () => import('@/domains/period-karbosnab/ui/PolycarbCalculator.vue'),
  ),
  [PeriodSlug.WizardsDev]: defineAsyncComponent(
    () => import('@/domains/period-wizardsdev/ui/SiteGrid.vue'),
  ),
  [PeriodSlug.Marines]: defineAsyncComponent(
    () => import('@/domains/period-marines/ui/NavyRadar.vue'),
  ),
  [PeriodSlug.GoIT]: defineAsyncComponent(
    () => import('@/domains/period-goit/ui/SkillTree.vue'),
  ),
  [PeriodSlug.StepAcademy]: defineAsyncComponent(
    () => import('@/domains/period-step-academy/ui/RetroIDE.vue'),
  ),
  [PeriodSlug.MykolaivBachelor]: defineAsyncComponent(
    () => import('@/shared/ui/period-visuals/BalanceSheet.vue'),
  ),
  [PeriodSlug.MykolaivAssociate]: defineAsyncComponent(
    () => import('@/shared/ui/period-visuals/BalanceSheet.vue'),
  ),
  [PeriodSlug.FreelanceEarly]: defineAsyncComponent(
    () => import('@/shared/ui/period-visuals/ProjectBoard.vue'),
  ),
  [PeriodSlug.FreelanceLate]: defineAsyncComponent(
    () => import('@/shared/ui/period-visuals/ProjectBoard.vue'),
  ),
  [PeriodSlug.ClickDealer]: defineAsyncComponent(
    () => import('@/shared/ui/period-visuals/BriefStint.vue'),
  ),
  [PeriodSlug.Rechout]: defineAsyncComponent(
    () => import('@/shared/ui/period-visuals/BriefStint.vue'),
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
