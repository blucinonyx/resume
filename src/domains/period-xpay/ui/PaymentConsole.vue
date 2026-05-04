<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useLang } from '@/shared/composables/useLang';
import { FormatService } from '@/shared/utils/format';
import { PaymentSimulationService } from '../services/PaymentSimulationService';
import { usePaymentStore } from '../stores/PaymentStore';

const lang = useLang();
const t = computed(() => lang.value.periods.xpay);

const store = usePaymentStore();

const avgLatency = computed<number>(() => PaymentSimulationService.decorativeLatencyMs());
const formattedTotal = computed<string>(() => FormatService.thousands(store.totalToday));

onMounted(() => store.start());
onBeforeUnmount(() => store.pause());
</script>

<template>
  <div class="pc" :class="{ 'pc--paused': !store.isRunning }">
    <header class="pc__head">
      <div class="pc__title-row">
        <span class="pc__live">{{ t.title }}</span>
        <div class="pc__badges" aria-hidden="true">
          <span class="pc__badge pc__badge--visa">VISA</span>
          <span class="pc__badge pc__badge--mc">MC</span>
          <span class="pc__badge">PCI&nbsp;DSS&nbsp;L1</span>
          <span class="pc__badge">3D&nbsp;Secure</span>
        </div>
      </div>
      <span class="pc__sub">{{ t.subtitle }}</span>
      <div class="pc__stats">
        <span>{{ t.todayLbl }} <strong>{{ formattedTotal }}</strong></span>
        <span>{{ t.successLbl }} <strong>{{ store.successRate }}</strong></span>
        <span>{{ t.avgLbl }} <strong>{{ avgLatency }}ms</strong></span>
      </div>
    </header>

    <ol class="pc__log">
      <li
        v-for="line in store.lines"
        :key="line.id"
        class="pc__line"
        :class="`pc__line--${line.status}`"
      >
        <span class="pc__ts">{{ line.timestamp }}</span>
        <span class="pc__brand" :class="`pc__brand--${line.brand}`">
          {{ line.brand === 'visa' ? 'VISA' : 'MC' }}
        </span>
        <span class="pc__status">
          <template v-if="line.status === 'init'">{{ t.init }}</template>
          <template v-else-if="line.status === 'auth'">→ {{ t.auth }}</template>
          <template v-else-if="line.status === '3ds'">→ {{ t.threeDS }}</template>
          <template v-else-if="line.status === 'approved'">{{ t.approved }}</template>
          <template v-else>{{ t.declined }}</template>
        </span>
        <span class="pc__meta">
          {{ FormatService.thousands(line.amount) }}&nbsp;{{ t.currency }} · ****{{ line.cardLast4 }} · {{ line.merchant }}
        </span>
      </li>
    </ol>

    <div class="pc__controls">
      <button
        type="button"
        class="pc__btn pc__btn--primary"
        :disabled="store.isRunning"
        @click="store.start()"
      >
        ▶ start
      </button>
      <button
        type="button"
        class="pc__btn"
        :disabled="!store.isRunning"
        @click="store.pause()"
      >
        ⏸ pause
      </button>
      <button type="button" class="pc__btn" @click="store.reset()">⟲ reset</button>
    </div>
  </div>
</template>

<style lang="scss" scoped src="@/domains/period-xpay/styles/PaymentConsole.scss"></style>
