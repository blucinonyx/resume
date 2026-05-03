<script setup lang="ts">
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';
import { PeriodType, type PeriodContent } from '@/shared/types/Period';

interface Props {
  content: PeriodContent;
  type: PeriodType;
}

defineProps<Props>();
const i18n = useI18nStore();

const labels = {
  [Lang.EN]: { context: 'Context', what: 'What I did', outcomes: 'Metrics', stack: 'Stack' },
  [Lang.UK]: { context: 'Контекст', what: 'Що я робив', outcomes: 'Метрики', stack: 'Стек' },
} as const;
</script>

<template>
  <div class="desc" :class="`desc--${type}`">
    <section v-if="content.context">
      <h3 class="desc__h">{{ labels[i18n.current].context }}</h3>
      <p class="desc__p">{{ content.context }}</p>
    </section>

    <section v-if="content.bullets.length">
      <h3 class="desc__h">{{ labels[i18n.current].what }}</h3>
      <ul class="desc__ul">
        <li v-for="(b, i) in content.bullets" :key="i">{{ b }}</li>
      </ul>
    </section>

    <blockquote v-if="content.quote" class="desc__quote">
      {{ content.quote }}
    </blockquote>

    <section v-if="content.metrics.length">
      <h3 class="desc__h">{{ labels[i18n.current].outcomes }}</h3>
      <div class="desc__metrics">
        <div v-for="m in content.metrics" :key="m.key" class="desc__metric">
          <span class="desc__metric-k">{{ m.key }}</span>
          <span class="desc__metric-v">{{ m.value }}</span>
        </div>
      </div>
    </section>

    <section v-if="content.stack.length">
      <h3 class="desc__h">{{ labels[i18n.current].stack }}</h3>
      <div class="desc__stack">
        <span v-for="t in content.stack" :key="t" class="desc__tag">{{ t }}</span>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.desc {
  padding: $space-5;
  border-right: 1px solid var(--color-border);

  @media (max-width: 920px) {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }

  section + section {
    margin-top: $space-4;
  }
}

.desc__h {
  margin: 0 0 $space-2;
  font-size: $fs-base;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text);
  font-weight: $fw-semibold;
}

.desc__p {
  margin: 0;
  color: var(--color-text);
  font-size: $fs-sm;
  line-height: 1.6;
}

.desc__ul {
  margin: 0;
  padding-left: $space-4;
  color: var(--color-text);
  font-size: $fs-sm;
  line-height: 1.55;

  li + li {
    margin-top: $space-2;
  }
}

.desc__quote {
  margin: $space-4 0 0;
  padding: $space-2 0 $space-2 $space-4;
  border-left: 2px solid var(--color-accent);
  color: var(--color-muted);
  font-style: italic;
  font-size: $fs-sm;

  .desc--edu & {
    border-left-color: var(--color-magenta);
  }
  .desc--mil & {
    border-left-color: var(--color-warning);
  }
}

.desc__metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-2;

  @media (max-width: $bp-mobile) {
    grid-template-columns: 1fr;
  }
}

.desc__metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  padding: $space-2 $space-3;
  font-family: $font-mono;
  font-size: $fs-xs;
}

.desc__metric-k {
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.65rem;
}

.desc__metric-v {
  color: var(--color-success);
  font-size: $fs-sm;

  .desc--edu & {
    color: var(--color-magenta);
  }
  .desc--mil & {
    color: var(--color-warning);
  }
}

.desc__stack {
  display: flex;
  flex-wrap: wrap;
  gap: $space-1;
}

.desc__tag {
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-sm;
  padding: 2px 8px;
  font-family: $font-mono;
  font-size: 0.7rem;
  color: var(--color-muted);
}
</style>
