<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';

type LogStatus = 'init' | 'auth' | '3ds' | 'approved' | 'declined';
type CardBrand = 'visa' | 'mc';
// Public XPAY partners + a couple of generic merchants from sectors xpay services
// (hotels, microfinance, insurance, tour-operators, utilities, retail).
const MERCHANTS = [
  'yakaboo.ua',
  'sportlife.ua',
  'smartplanet.ua',
  'otpusk.com',
  'hotel.kiev',
  'mfo.express',
  'insure.ua',
  'utility.kyiv',
] as const;

interface LogLine {
  id: number;
  timestamp: string;
  status: LogStatus;
  amount: number;
  cardLast4: string;
  brand: CardBrand;
  merchant: string;
  txnId: string;
}

const i18n = useI18nStore();

const labels = {
  [Lang.EN]: {
    title: 'XPAY · live payment gateway',
    subtitle: 'Internet acquiring · 3DS · PCI DSS L1',
    todayLbl: 'processed today',
    successLbl: 'success rate',
    avgLbl: 'avg latency',
    init: 'POST /charge',
    auth: 'auth',
    threeDS: '3DS challenge',
    approved: '✓ approved',
    declined: '✗ declined',
    sectorsLbl: 'merchants',
    currency: 'UAH',
  },
  [Lang.UK]: {
    title: 'XPAY · live платіжний шлюз',
    subtitle: 'Internet-еквайринг · 3DS · PCI DSS L1',
    todayLbl: 'оброблено сьогодні',
    successLbl: 'успішних',
    avgLbl: 'середня затримка',
    init: 'POST /charge',
    auth: 'auth',
    threeDS: '3DS challenge',
    approved: '✓ approved',
    declined: '✗ declined',
    sectorsLbl: 'мерчанти',
    currency: 'грн',
  },
} as const;
const t = computed(() => labels[i18n.current]);

const lines = ref<LogLine[]>([]);
const totalToday = ref(0);
const successCount = ref(0);
const isRunning = ref(false);
let nextId = 1;

function pad(n: number, w = 2): string {
  return String(n).padStart(w, '0');
}

function nowStamp(): string {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3).slice(0, 3)}`;
}

function randAmount(): number {
  // Weighted toward small/mid charges
  const r = Math.random();
  if (r < 0.55) return Math.round(50 + Math.random() * 450);
  if (r < 0.85) return Math.round(500 + Math.random() * 1500);
  return Math.round(2000 + Math.random() * 8000);
}

function randCard(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function randTxn(): string {
  return 'txn_' + Math.random().toString(36).slice(2, 10);
}

function appendLine(line: Omit<LogLine, 'id'>): void {
  const next = { ...line, id: nextId++ };
  lines.value = [...lines.value.slice(-9), next];
}

async function simulateCharge(): Promise<void> {
  const amount = randAmount();
  const cardLast4 = randCard();
  const brand: CardBrand = Math.random() < 0.6 ? 'visa' : 'mc';
  const merchant = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
  const txnId = randTxn();
  const requires3DS = Math.random() < 0.45;
  const willDecline = Math.random() < 0.07;

  appendLine({ timestamp: nowStamp(), status: 'init', amount, cardLast4, brand, merchant, txnId });
  await wait(180 + Math.random() * 220);

  appendLine({ timestamp: nowStamp(), status: 'auth', amount, cardLast4, brand, merchant, txnId });
  await wait(120 + Math.random() * 280);

  if (requires3DS) {
    appendLine({ timestamp: nowStamp(), status: '3ds', amount, cardLast4, brand, merchant, txnId });
    await wait(380 + Math.random() * 420);
  }

  totalToday.value += 1;
  if (willDecline) {
    appendLine({ timestamp: nowStamp(), status: 'declined', amount, cardLast4, brand, merchant, txnId });
  } else {
    successCount.value += 1;
    appendLine({ timestamp: nowStamp(), status: 'approved', amount, cardLast4, brand, merchant, txnId });
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function loop(): Promise<void> {
  if (!isRunning.value) return;
  await simulateCharge();
  if (isRunning.value) {
    await wait(400 + Math.random() * 600);
    loop();
  }
}

function start(): void {
  if (isRunning.value) return;
  isRunning.value = true;
  // Seed with a couple of historic lines for visual fullness
  if (lines.value.length === 0) {
    totalToday.value = 218;
    successCount.value = 207;
  }
  loop();
}

function pause(): void {
  isRunning.value = false;
}

function reset(): void {
  pause();
  lines.value = [];
  totalToday.value = 0;
  successCount.value = 0;
}

const successRate = computed<string>(() => {
  if (totalToday.value === 0) return '—';
  return `${((successCount.value / totalToday.value) * 100).toFixed(1)}%`;
});

const avgLatency = computed<number>(() => {
  // Decorative — emulate p99-like jitter
  return Math.round(280 + Math.sin(Date.now() / 4000) * 60);
});

onMounted(() => start());
onBeforeUnmount(() => pause());
</script>

<template>
  <div class="pc" :class="{ 'pc--paused': !isRunning }">
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
        <span>{{ t.todayLbl }} <strong>{{ totalToday.toLocaleString('en-US') }}</strong></span>
        <span>{{ t.successLbl }} <strong>{{ successRate }}</strong></span>
        <span>{{ t.avgLbl }} <strong>{{ avgLatency }}ms</strong></span>
      </div>
    </header>

    <ol class="pc__log">
      <li
        v-for="line in lines"
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
          {{ line.amount.toLocaleString('en-US') }}&nbsp;{{ t.currency }} · ****{{ line.cardLast4 }} · {{ line.merchant }}
        </span>
      </li>
    </ol>

    <div class="pc__controls">
      <button
        type="button"
        class="pc__btn pc__btn--primary"
        :disabled="isRunning"
        @click="start"
      >
        ▶ start
      </button>
      <button
        type="button"
        class="pc__btn"
        :disabled="!isRunning"
        @click="pause"
      >
        ⏸ pause
      </button>
      <button type="button" class="pc__btn" @click="reset">⟲ reset</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pc {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
  font-size: $fs-xs;
}

.pc__head {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
}

.pc__title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $space-2;
  flex-wrap: wrap;
}

.pc__live {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  font-size: $fs-xs;
  color: var(--color-success);
  text-transform: uppercase;
  letter-spacing: 0.06em;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: $radius-full;
    background: var(--color-success);
    box-shadow: var(--glow-success);
    animation: pcPulse 1.4s infinite;
  }
}

.pc__sub {
  font-size: 0.62rem;
  color: var(--color-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pc__badges {
  display: inline-flex;
  gap: 4px;
  flex-wrap: wrap;
}

.pc__badge {
  font-size: 0.6rem;
  padding: 2px 6px;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-sm;
  color: var(--color-muted);
  letter-spacing: 0.04em;
  font-weight: $fw-bold;

  &--visa {
    color: #1a1f71;
    background: linear-gradient(180deg, #f0c14b, #e8b03a);
    border-color: #c79722;
  }
  &--mc {
    color: #fff;
    background: linear-gradient(135deg, #eb001b 50%, #f79e1b 50%);
    border-color: #c30000;
  }
}

.pc--paused .pc__live {
  color: var(--color-muted);

  &::before {
    animation-play-state: paused;
    background: var(--color-muted);
    box-shadow: none;
  }
}

@keyframes pcPulse {
  50% {
    opacity: 0.3;
  }
}

.pc__stats {
  display: flex;
  gap: $space-4;
  flex-wrap: wrap;
  color: var(--color-muted);

  strong {
    color: var(--color-accent);
    font-weight: $fw-semibold;
    margin-left: 2px;
  }
}

.pc__log {
  list-style: none;
  margin: 0;
  padding: $space-3;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  min-height: 220px;
  max-height: 220px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 3px;
}

.pc__line {
  display: flex;
  gap: $space-2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: pcLineIn 200ms ease-out;
}

@keyframes pcLineIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pc__ts {
  color: var(--color-muted);
  flex-shrink: 0;
}

.pc__brand {
  flex-shrink: 0;
  font-size: 0.55rem;
  font-weight: $fw-bold;
  padding: 1px 4px;
  border-radius: 2px;
  letter-spacing: 0.04em;

  &--visa {
    color: #1a1f71;
    background: #f0c14b;
  }
  &--mc {
    color: #fff;
    background: linear-gradient(135deg, #eb001b 50%, #f79e1b 50%);
  }
}

.pc__status {
  flex-shrink: 0;
  font-weight: $fw-semibold;
}

.pc__line--init .pc__status {
  color: var(--color-text);
}
.pc__line--auth .pc__status,
.pc__line--3ds .pc__status {
  color: var(--color-warning);
}
.pc__line--approved .pc__status {
  color: var(--color-success);
}
.pc__line--declined .pc__status {
  color: var(--color-magenta);
}

.pc__meta {
  color: var(--color-muted);
  overflow: hidden;
  text-overflow: ellipsis;
}

.pc__controls {
  display: flex;
  gap: $space-2;
}

.pc__btn {
  background: var(--color-panel-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: $space-2 $space-3;
  border-radius: $radius-md;
  font-family: $font-mono;
  font-size: $fs-xs;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &--primary {
    background: var(--color-accent);
    color: var(--color-bg);
    border-color: var(--color-accent);

    &:hover:not(:disabled) {
      background: var(--color-accent-hover);
      border-color: var(--color-accent-hover);
      color: var(--color-bg);
    }
  }
}
</style>
