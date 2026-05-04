<script setup lang="ts">
import { computed } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { ContentService } from '@/domains/resume/services/ContentService';
import { useLang } from '@/shared/composables/useLang';
import { PeriodType, type PeriodSlug } from '@/shared/types/Period';

interface Props {
  slug: PeriodSlug;
}

const props = defineProps<Props>();
const i18n = useI18nStore();
const lang = useLang();

const meta = computed(() => ContentService.meta(props.slug));
const content = computed(() => ContentService.content(props.slug, i18n.current));
const range = computed(() => (meta.value ? ContentService.formatRange(meta.value, i18n.current) : ''));

const t = computed(() => lang.value.roleLayout);

const accentVar = computed<string>(() => {
  if (!meta.value) return '--color-accent';
  if (meta.value.type === PeriodType.Education) return '--color-type-edu';
  if (meta.value.type === PeriodType.Military) return '--color-type-mil';
  return '--color-accent';
});

// Place "What I did" in the compact side column when there are very few
// bullets (≤ 2), otherwise lift it into the full-width footer with a 2-col
// grid where longer lists breathe better.
const SIDE_BULLETS_THRESHOLD = 2;
const bulletsInSide = computed<boolean>(
  () => !!content.value && content.value.bullets.length > 0 && content.value.bullets.length <= SIDE_BULLETS_THRESHOLD,
);
const bulletsInFooter = computed<boolean>(
  () => !!content.value && content.value.bullets.length > SIDE_BULLETS_THRESHOLD,
);
</script>

<template>
  <div class="role">
    <article
      v-if="content && meta"
      class="role__deep"
      :class="`role__deep--${meta.type}`"
      :style="{ '--role-accent': `var(${accentVar})` }"
    >
      <header class="role__head">
        <h2 class="role__title">
          {{ content.title }}
          <small>· {{ content.subtitle }} · {{ range }}<template v-if="content.location"> · {{ content.location }}</template></small>
        </h2>
        <a
          v-if="content.url"
          class="role__link"
          :href="content.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ content.url.replace(/^https?:\/\//, '') }} ↗
        </a>
      </header>

      <div class="role__body">
        <aside class="role__side">
          <section v-if="content.context" class="role__section">
            <h3 class="role__h">{{ t.context }}</h3>
            <p class="role__context">{{ content.context }}</p>
          </section>

          <section v-if="content.metrics.length" class="role__section">
            <h3 class="role__h">{{ t.metrics }}</h3>
            <ul class="role__metrics">
              <li v-for="m in content.metrics" :key="m.key" class="role__metric">
                <span class="role__metric-k">{{ m.key }}</span>
                <span class="role__metric-v">{{ m.value }}</span>
              </li>
            </ul>
          </section>

          <section v-if="content.stack.length" class="role__section">
            <h3 class="role__h">{{ t.stack }}</h3>
            <div class="role__stack">
              <span v-for="s in content.stack" :key="s" class="role__tag">{{ s }}</span>
            </div>
          </section>

          <section v-if="bulletsInSide" class="role__section">
            <h3 class="role__h">{{ t.what }}</h3>
            <ul class="role__bullets">
              <li v-for="(b, i) in content.bullets" :key="i">{{ b }}</li>
            </ul>
          </section>
        </aside>

        <div class="role__visual">
          <header class="role__visual-head">
            <span class="role__visual-tag">{{ t.interactive }}</span>
          </header>
          <div class="role__visual-stage">
            <slot name="visual" :slug="props.slug" :content="content" :meta="meta">
              <div class="role__placeholder">
                <span class="role__placeholder-mark">⚡</span>
                <p>Custom interactive coming soon for this period.</p>
              </div>
            </slot>
          </div>
        </div>
      </div>

      <footer
        v-if="bulletsInFooter || content.quote"
        class="role__footer"
      >
        <section v-if="bulletsInFooter" class="role__section">
          <h3 class="role__h">{{ t.what }}</h3>
          <ul class="role__bullets role__bullets--wide">
            <li v-for="(b, i) in content.bullets" :key="i">{{ b }}</li>
          </ul>
        </section>

        <blockquote v-if="content.quote" class="role__quote">
          {{ content.quote }}
        </blockquote>
      </footer>
    </article>
  </div>
</template>

<style lang="scss" scoped src="@/shared/styles/RoleLayout.scss"></style>
