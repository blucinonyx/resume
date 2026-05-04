<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';
import { PeriodSlug } from '@/shared/types/Period';

interface Entry {
  id: number;
  label: string;
  amount: number;
  side: 'debit' | 'credit';
}

const route = useRoute();
const i18n = useI18nStore();

const variant = computed<'associate' | 'bachelor'>(() => {
  const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;
  return slug === PeriodSlug.MykolaivBachelor ? 'bachelor' : 'associate';
});

const labels = {
  [Lang.EN]: {
    associate: 'Accounting & Audit · Associate · 2010—2013',
    bachelor: 'Finance & Credit · Bachelor · 2013—2015',
    debit: 'Debit',
    credit: 'Credit',
    balanced: 'Balanced',
    sources: ['Cash', 'Inventory', 'A/R', 'Equipment', 'Sales rev.', 'A/P', 'Loan', 'Equity'],
    note: 'Two finance degrees gave me the language for fintech work. The double-entry discipline still shows up when I design schemas with audit trails.',
  },
  [Lang.UK]: {
    associate: 'Бухоблік і Аудит · Молодший спец · 2010—2013',
    bachelor: 'Фінанси і Кредит · Бакалавр · 2013—2015',
    debit: 'Дебет',
    credit: 'Кредит',
    balanced: 'Баланс',
    sources: ['Каса', 'Запаси', 'Дт', 'Обладнання', 'Виручка', 'Кт', 'Кредит', 'Капітал'],
    note: 'Дві фінансові освіти дали мову для роботи в fintech. Дисципліна подвійного запису і досі вилазить коли проектую схеми з audit trail.',
  },
} as const;
const t = computed(() => labels[i18n.current]);

const title = computed(() => (variant.value === 'bachelor' ? t.value.bachelor : t.value.associate));

const entries = ref<Entry[]>([]);
let nextId = 1;
let intId = 0;

function pushEntry(): void {
  const sources = t.value.sources;
  const isDebit = Math.random() < 0.5;
  const lbl = sources[Math.floor(Math.random() * sources.length)];
  const amt = Math.round(100 + Math.random() * 9900);
  const e: Entry = {
    id: nextId++,
    label: lbl,
    amount: amt,
    side: isDebit ? 'debit' : 'credit',
  };
  entries.value = [...entries.value, e].slice(-12);
}

onMounted(() => {
  for (let i = 0; i < 4; i++) pushEntry();
  intId = window.setInterval(pushEntry, 2200);
});
onBeforeUnmount(() => window.clearInterval(intId));

const debits = computed(() => entries.value.filter((e) => e.side === 'debit'));
const credits = computed(() => entries.value.filter((e) => e.side === 'credit'));
const debitTotal = computed(() => debits.value.reduce((s, e) => s + e.amount, 0));
const creditTotal = computed(() => credits.value.reduce((s, e) => s + e.amount, 0));
</script>

<template>
  <div class="bs">
    <header class="bs__head">
      <span class="bs__title">{{ title }}</span>
      <span class="bs__balanced">≡ {{ t.balanced }}</span>
    </header>

    <div class="bs__taccount">
      <div class="bs__col bs__col--debit">
        <span class="bs__col-key">{{ t.debit }}</span>
        <ul class="bs__rows">
          <li v-for="e in debits" :key="e.id" class="bs__row">
            <span>{{ e.label }}</span>
            <span class="bs__amt">{{ e.amount.toLocaleString('en-US') }}</span>
          </li>
        </ul>
        <div class="bs__total">
          <span>Σ</span>
          <span class="bs__amt">{{ debitTotal.toLocaleString('en-US') }}</span>
        </div>
      </div>

      <div class="bs__divider" aria-hidden="true" />

      <div class="bs__col bs__col--credit">
        <span class="bs__col-key">{{ t.credit }}</span>
        <ul class="bs__rows">
          <li v-for="e in credits" :key="e.id" class="bs__row">
            <span>{{ e.label }}</span>
            <span class="bs__amt">{{ e.amount.toLocaleString('en-US') }}</span>
          </li>
        </ul>
        <div class="bs__total">
          <span>Σ</span>
          <span class="bs__amt">{{ creditTotal.toLocaleString('en-US') }}</span>
        </div>
      </div>
    </div>

    <p class="bs__note">{{ t.note }}</p>
  </div>
</template>

<style lang="scss" scoped>
.bs {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
}

.bs__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
  flex-wrap: wrap;
  gap: $space-2;
}

.bs__title {
  font-size: $fs-xs;
  color: var(--color-type-edu);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.bs__balanced {
  font-size: $fs-xs;
  color: var(--color-success);
}

.bs__taccount {
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  padding: $space-3;
  min-height: 240px;
}

.bs__col {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  padding: 0 $space-3;
}

.bs__col-key {
  font-size: $fs-xs;
  color: var(--color-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-bottom: 1px dashed var(--color-border);
  padding-bottom: $space-1;
}

.bs__divider {
  background: var(--color-border);
}

.bs__rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  font-size: $fs-xs;
}

.bs__row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
  color: var(--color-text);
  animation: bsRowIn 240ms ease-out;
}

@keyframes bsRowIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.bs__amt {
  font-feature-settings: 'tnum';
  color: var(--color-accent);
}

.bs__col--credit .bs__amt {
  color: var(--color-magenta);
}

.bs__total {
  display: flex;
  justify-content: space-between;
  padding-top: $space-1;
  border-top: 1px solid var(--color-border);
  font-weight: $fw-bold;
  font-size: $fs-sm;
  color: var(--color-text-strong);
}

.bs__note {
  margin: 0;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  line-height: 1.5;
}
</style>
