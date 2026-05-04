<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';

interface Tx {
  id: number;
  label: string;
  amount: number;
  kind: 'in' | 'out';
}

const i18n = useI18nStore();

const labels = {
  [Lang.EN]: {
    label: 'Wallet · Laravel + Vue prototype',
    cardLbl: 'KoshelOK Wallet',
    bal: 'Available balance',
    tx: 'Recent activity',
    sources: ['salary deposit', 'utility payment', 'transfer in', 'cashback', 'top-up'],
    note: 'Built the Laravel backend + Vue dashboard for the new product. Brief tenure (4 months) but the architecture pattern carried forward.',
    currency: 'UAH',
  },
  [Lang.UK]: {
    label: 'Гаманець · Laravel + Vue prototype',
    cardLbl: 'KoshelOK Wallet',
    bal: 'Доступний баланс',
    tx: 'Остання активність',
    sources: ['зарплата', 'комунальні', 'переказ', 'кешбек', 'поповнення'],
    note: 'Будував Laravel-бекенд + Vue-дашборд для нового продукту. 4 місяці, але архітектурний патерн пішов далі.',
    currency: 'грн',
  },
} as const;
const t = computed(() => labels[i18n.current]);

const balance = ref(48_320);
const txs = ref<Tx[]>([
  { id: 0, label: 'salary deposit', amount: 32000, kind: 'in' },
  { id: 1, label: 'utility payment', amount: -2150, kind: 'out' },
  { id: 2, label: 'transfer in', amount: 1500, kind: 'in' },
]);
let nextId = 3;
let intId = 0;

function pushTx(): void {
  const isIn = Math.random() < 0.45;
  const sources = t.value.sources;
  const label = sources[Math.floor(Math.random() * sources.length)];
  const amount = (isIn ? 1 : -1) * (50 + Math.round(Math.random() * 1500));
  const kind: 'in' | 'out' = isIn ? 'in' : 'out';
  balance.value = Math.max(1000, balance.value + amount);
  txs.value = [{ id: nextId++, label, amount, kind }, ...txs.value].slice(0, 5);
}

onMounted(() => {
  intId = window.setInterval(pushTx, 3500);
});
onBeforeUnmount(() => window.clearInterval(intId));

const fmt = (n: number): string => `${n.toLocaleString('en-US')} ${t.value.currency}`;
</script>

<template>
  <div class="wallet">
    <header class="wallet__head">
      <span class="wallet__label">{{ t.label }}</span>
    </header>

    <div class="wallet__card">
      <span class="wallet__brand">{{ t.cardLbl }}</span>
      <span class="wallet__chip" aria-hidden="true" />
      <span class="wallet__bal-key">{{ t.bal }}</span>
      <span class="wallet__bal-val">{{ fmt(balance) }}</span>
      <span class="wallet__num">**** **** **** 4218</span>
    </div>

    <div class="wallet__list">
      <span class="wallet__list-key">{{ t.tx }}</span>
      <ul>
        <li
          v-for="tx in txs"
          :key="tx.id"
          class="wallet__row"
          :class="`wallet__row--${tx.kind}`"
        >
          <span class="wallet__row-arr">{{ tx.kind === 'in' ? '↓' : '↑' }}</span>
          <span class="wallet__row-lbl">{{ tx.label }}</span>
          <span class="wallet__row-amt">{{ tx.amount > 0 ? '+' : '' }}{{ fmt(tx.amount) }}</span>
        </li>
      </ul>
    </div>

    <p class="wallet__note">{{ t.note }}</p>
  </div>
</template>

<style lang="scss" scoped>
.wallet {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
}

.wallet__head {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
}

.wallet__label {
  font-size: $fs-xs;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.wallet__card {
  position: relative;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent 60%),
    linear-gradient(135deg, #0f172a, #1e293b);
  border: 1px solid var(--color-accent);
  border-radius: $radius-lg;
  padding: $space-4 $space-5;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: $space-2 $space-3;
  color: #e6f3ff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  min-height: 160px;
}

.wallet__brand {
  font-size: $fs-md;
  font-weight: $fw-bold;
  letter-spacing: 0.04em;
}

.wallet__chip {
  width: 36px;
  height: 26px;
  border-radius: 4px;
  background: linear-gradient(135deg, #ffd54f, #b8881a);
  align-self: start;
  justify-self: end;
  border: 1px solid #b8881a;
}

.wallet__bal-key {
  grid-column: 1 / -1;
  font-size: 0.7rem;
  color: var(--color-muted);
  margin-top: $space-3;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.wallet__bal-val {
  grid-column: 1 / -1;
  font-size: 1.6rem;
  font-weight: $fw-bold;
  color: var(--color-accent);
}

.wallet__num {
  grid-column: 1 / -1;
  font-size: $fs-xs;
  letter-spacing: 0.2em;
  color: #a8c7e6;
}

.wallet__list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.wallet__list-key {
  font-size: $fs-xs;
  color: var(--color-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.wallet__list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: $space-1;
  // Reserve space for the maximum (5) rows so the layout doesn't jump.
  // Each row is ≈ 38px (padding + border + line-height) + 4px gap → ~218px.
  min-height: 220px;
}

.wallet__row {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  gap: $space-2;
  align-items: center;
  padding: $space-2 $space-3;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  font-size: $fs-sm;
  animation: txSlideIn 280ms ease-out;
}

@keyframes txSlideIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.wallet__row-arr {
  font-weight: $fw-bold;
  text-align: center;
}

.wallet__row--in .wallet__row-arr,
.wallet__row--in .wallet__row-amt {
  color: var(--color-success);
}
.wallet__row--out .wallet__row-arr,
.wallet__row--out .wallet__row-amt {
  color: var(--color-magenta);
}

.wallet__row-lbl {
  color: var(--color-text);
}

.wallet__row-amt {
  font-weight: $fw-semibold;
}

.wallet__note {
  margin: 0;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  line-height: 1.5;
}
</style>
