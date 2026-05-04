<script setup lang="ts">
import { computed } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { ContentService } from '@/domains/resume/services/ContentService';
import { Lang } from '@/shared/types/Lang';
import { PeriodType, type PeriodSlug } from '@/shared/types/Period';

interface Props {
  slug: PeriodSlug;
}

const props = defineProps<Props>();
const i18n = useI18nStore();

const meta = computed(() => ContentService.meta(props.slug));
const content = computed(() => ContentService.content(props.slug, i18n.current));
const range = computed(() => (meta.value ? ContentService.formatRange(meta.value, i18n.current) : ''));

const labels = {
  [Lang.EN]: {
    interactive: 'Interactive · live demo',
    context: 'Context',
    metrics: 'Metrics',
    stack: 'Stack',
    what: 'What I did',
  },
  [Lang.UK]: {
    interactive: 'Інтерактив · live demo',
    context: 'Контекст',
    metrics: 'Метрики',
    stack: 'Стек',
    what: 'Що я робив',
  },
} as const;
const t = computed(() => labels[i18n.current]);

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

<style lang="scss" scoped>
.role {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.role__deep {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  // No top border at all — eliminates the cross-fade flash between periods of
  // different types. The active tab's own 3-sided accent border carries the
  // type-color signal entirely.
  border-top: 0;
  border-radius: 0 0 $radius-xl $radius-xl;
  overflow: hidden;
  box-shadow: var(--shadow-panel);
}

// Compact single-row header
.role__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: $space-4;
  padding: $space-3 $space-5;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-panel-2);
  flex-wrap: wrap;
}

.role__title {
  margin: 0;
  font-size: $fs-md;
  font-weight: $fw-bold;
  color: var(--color-text-strong);

  small {
    color: var(--color-muted);
    font-weight: $fw-normal;
    font-size: $fs-xs;
    font-family: $font-mono;
    margin-left: $space-2;
  }
}

.role__link {
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--role-accent);
  white-space: nowrap;
}

// Two-column body: compact side · widget gets the room
.role__body {
  display: grid;
  grid-template-columns: minmax(240px, 32%) 1fr;
  gap: 0;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr;
  }
}

.role__side {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  padding: $space-4 $space-5;
  border-right: 1px solid var(--color-border);
  background: var(--color-panel);

  @media (max-width: $bp-tablet) {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    padding: $space-4;
  }
}

.role__section {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.role__h {
  margin: 0;
  font-size: 0.65rem;
  font-family: $font-mono;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: $fw-semibold;
}

.role__context {
  margin: 0;
  font-size: $fs-sm;
  line-height: 1.55;
  color: var(--color-text);
}

.role__metrics {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role__metric {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: $space-2;
  padding: 4px 8px;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-left: 2px solid var(--role-accent);
  border-radius: $radius-sm;
  font-family: $font-mono;
  font-size: $fs-xs;
}

.role__metric-k {
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.6rem;
}

.role__metric-v {
  color: var(--role-accent);
  font-weight: $fw-bold;
  text-align: right;
}

.role__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.role__tag {
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-sm;
  padding: 2px 7px;
  font-family: $font-mono;
  font-size: 0.65rem;
  color: var(--color-text);
  transition: border-color $transition-fast, color $transition-fast;

  &:hover {
    border-color: var(--role-accent);
    color: var(--role-accent);
  }
}

// Visual panel — gets generous width
.role__visual {
  display: flex;
  flex-direction: column;
  background: color-mix(in srgb, var(--color-panel-2) 70%, var(--color-bg));
}

.role__visual-head {
  padding: $space-3 $space-4 0;
}

.role__visual-tag {
  font-family: $font-mono;
  font-size: 0.65rem;
  color: var(--role-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: inline-flex;
  align-items: center;
  gap: $space-2;

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: $radius-full;
    background: var(--role-accent);
    box-shadow: 0 0 8px var(--role-accent);
    animation: rolePulse 1.6s infinite;
  }
}

@keyframes rolePulse {
  50% { opacity: 0.35; }
}

.role__visual-stage {
  padding: $space-3 $space-4 $space-4;
  flex: 1;
  min-height: 320px;
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
  padding: $space-5;
  min-height: 200px;
}

.role__placeholder-mark {
  font-size: 1.6rem;
  margin-bottom: $space-2;
}

// Footer below the body — bullets in 2-col + quote
.role__footer {
  padding: $space-4 $space-5;
  border-top: 1px solid var(--color-border);
  background: var(--color-panel-2);
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.role__bullets {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;

  // Each bullet is its own self-contained card with an accent-coloured
  // left bar. Looks consistent whether the bullet is one short line or
  // four wrapped lines, and consistent whether there are 1 bullet or 10.
  li {
    position: relative;
    padding: $space-2 $space-3;
    background: color-mix(in srgb, var(--color-panel-2) 55%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
    border-left: 2px solid var(--role-accent);
    border-radius: 0 $radius-sm $radius-sm 0;
    color: var(--color-text);
    font-size: $fs-xs;
    line-height: 1.55;
  }
}

// Wide variant — used in the footer when there are many bullets. Same card
// styling, just laid out in 2 columns on tablet+ to stop the list feeling
// cramped/long when there are many items.
.role__bullets--wide {
  @media (min-width: $bp-tablet) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px $space-3;
  }
}

.role__quote {
  margin: 0;
  padding: $space-2 $space-4;
  border-left: 3px solid var(--role-accent);
  background: var(--color-panel);
  border-radius: 0 $radius-md $radius-md 0;
  color: var(--color-text);
  font-style: italic;
  font-size: $fs-sm;
  line-height: 1.55;
  max-width: 80ch;
}
</style>
