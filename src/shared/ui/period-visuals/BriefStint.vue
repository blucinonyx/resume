<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { ContentService } from '@/domains/resume/services/ContentService';
import { useLang } from '@/shared/composables/useLang';
import { BriefStintService } from '@/shared/utils/BriefStintService';

const route = useRoute();
const i18n = useI18nStore();
const lang = useLang();

const currentSlug = computed(() => BriefStintService.parseSlug(route.params.slug));
const meta = computed(() => (currentSlug.value ? ContentService.meta(currentSlug.value) : null));
const content = computed(() =>
  currentSlug.value ? ContentService.content(currentSlug.value, i18n.current) : null,
);
const range = computed(() =>
  meta.value ? ContentService.formatRange(meta.value, i18n.current) : '',
);

const t = computed(() => lang.value.briefStint);

const ticketCount = computed(() => BriefStintService.ticketCount(currentSlug.value));
const blurb = computed(() => BriefStintService.blurb(currentSlug.value, t.value.blurbs, content.value));
const headerLabel = computed(() => BriefStintService.headerLabel(content.value, range.value));
const stack = computed(() => BriefStintService.stack(content.value));
</script>

<template>
  <div class="brief">
    <header class="brief__head">
      <span class="brief__label">{{ headerLabel }}</span>
    </header>

    <div class="brief__panel">
      <div class="brief__counter">
        <span class="brief__counter-num">{{ ticketCount }}</span>
        <span class="brief__counter-key">{{ t.ticketsClosed }}</span>
      </div>

      <div class="brief__stack">
        <span v-for="s in stack" :key="s" class="brief__chip">{{ s }}</span>
      </div>
    </div>

    <p class="brief__sentence">// {{ blurb }}</p>
  </div>
</template>

<style lang="scss" scoped src="@/shared/styles/period-visuals/BriefStint.scss"></style>
