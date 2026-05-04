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

<style lang="scss" scoped src="@/shared/styles/period-visuals/BalanceSheet.scss"></style>
