<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLang } from '@/shared/composables/useLang';
import { FormatService } from '@/shared/utils/format';
import { WalletService } from '../services/WalletService';
import type { Tx } from '../interface/WalletTypes';

const TICK_INTERVAL_MS = 3500;

const lang = useLang();
const t = computed(() => lang.value.periods.koshelok);

const balance = ref(48_320);
const txs = ref<Tx[]>([
  { id: 0, label: 'salary deposit', amount: 32000, kind: 'in' },
  { id: 1, label: 'utility payment', amount: -2150, kind: 'out' },
  { id: 2, label: 'transfer in', amount: 1500, kind: 'in' },
]);
let nextId = 3;
let intId = 0;

function pushTx(): void {
  const result = WalletService.randomTick(t.value.sources, balance.value, () => nextId++);
  balance.value = result.newBalance;
  txs.value = WalletService.prepend(txs.value, result.tx);
}

onMounted(() => {
  intId = window.setInterval(pushTx, TICK_INTERVAL_MS);
});
onBeforeUnmount(() => window.clearInterval(intId));

function fmt(n: number): string {
  return `${FormatService.thousands(n)} ${t.value.currency}`;
}
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

<style lang="scss" scoped src="@/domains/period-koshelok/styles/WalletCard.scss"></style>
