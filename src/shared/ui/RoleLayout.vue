<script setup lang="ts">
import { computed } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { ContentService } from '@/domains/resume/services/ContentService';
import CareerStrip from './CareerStrip.vue';
import RoleDescription from './RoleDescription.vue';
import { type PeriodSlug } from '@/shared/types/Period';

interface Props {
  slug: PeriodSlug;
}

const props = defineProps<Props>();
const i18n = useI18nStore();

const meta = computed(() => ContentService.meta(props.slug));
const content = computed(() => ContentService.content(props.slug, i18n.current));
const range = computed(() => (meta.value ? ContentService.formatRange(meta.value, i18n.current) : ''));
</script>

<template>
  <div class="role">
    <CareerStrip :active-slug="props.slug" />

    <div v-if="content && meta" class="role__deep" :class="`role__deep--${meta.type}`">
      <header class="role__head">
        <div>
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
        </div>
      </header>

      <div class="role__body">
        <RoleDescription :content="content" :type="meta.type" />
        <div class="role__visual">
          <slot name="visual" :slug="props.slug" :content="content" :meta="meta">
            <div class="role__placeholder">
              <span class="role__placeholder-mark">⚡</span>
              <p>Custom interactive coming soon for this period.</p>
              <p class="role__placeholder-hint">
                Until then, the description on the left has the full story.
              </p>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.role {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.role__deep {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: var(--shadow-panel);

  &--work {
    border-top: 3px solid var(--color-type-work);
  }
  &--edu {
    border-top: 3px solid var(--color-type-edu);
  }
  &--mil {
    border-top: 3px solid var(--color-type-mil);
  }
}

.role__head {
  padding: $space-5 $space-5 $space-4;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-panel-2);
}

.role__title {
  margin: 0;
  font-size: $fs-lg;
  font-weight: $fw-bold;
  color: var(--color-text-strong);

  small {
    color: var(--color-muted);
    font-weight: $fw-normal;
    font-size: $fs-sm;
    font-family: $font-mono;
    margin-left: $space-2;
  }
}

.role__link {
  display: inline-block;
  margin-top: $space-1;
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--color-accent);
}

.role__body {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 0;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
}

.role__visual {
  padding: $space-5;
  background: color-mix(in srgb, var(--color-panel) 60%, var(--color-bg));
  min-height: 280px;
}

.role__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--color-muted);
  border: 1px dashed var(--color-border);
  border-radius: $radius-lg;
  padding: $space-6;
}

.role__placeholder-mark {
  font-size: 2rem;
  margin-bottom: $space-3;
}

.role__placeholder-hint {
  font-size: $fs-xs;
  color: var(--color-muted);
  margin-top: $space-2;
}
</style>
