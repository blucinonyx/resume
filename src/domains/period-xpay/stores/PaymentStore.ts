import { defineStore } from 'pinia';
import { PaymentSimulationService } from '../services/PaymentSimulationService';
import type { CardBrand, LogLine, LogStatus } from '../interface/PaymentTypes';

const LINE_HISTORY = 10; // ticker keeps last 10 lines visible

interface PaymentState {
  lines: LogLine[];
  totalToday: number;
  successCount: number;
  isRunning: boolean;
  nextId: number;
}

export const usePaymentStore = defineStore('payment', {
  state: (): PaymentState => ({
    lines: [],
    totalToday: 0,
    successCount: 0,
    isRunning: false,
    nextId: 1,
  }),

  getters: {
    successRate(state): string {
      if (state.totalToday === 0) return '—';
      return `${((state.successCount / state.totalToday) * 100).toFixed(1)}%`;
    },
  },

  actions: {
    start(): void {
      if (this.isRunning) return;
      this.isRunning = true;
      // Seed historical baseline so the dashboard isn't blank on first paint
      if (this.lines.length === 0) {
        this.totalToday = 218;
        this.successCount = 207;
      }
      void this.runLoop();
    },

    pause(): void {
      this.isRunning = false;
    },

    reset(): void {
      this.pause();
      this.lines = [];
      this.totalToday = 0;
      this.successCount = 0;
    },

    appendLine(line: Omit<LogLine, 'id'>): void {
      const next: LogLine = { ...line, id: this.nextId++ };
      this.lines = [...this.lines.slice(-(LINE_HISTORY - 1)), next];
    },

    /** One full charge: init → auth → optional 3DS → approved/declined. */
    async simulateCharge(): Promise<void> {
      const amount = PaymentSimulationService.randAmount();
      const cardLast4 = PaymentSimulationService.randCard();
      const brand: CardBrand = PaymentSimulationService.randBrand();
      const merchant = PaymentSimulationService.randMerchant();
      const txnId = PaymentSimulationService.randTxn();
      const requires3DS = Math.random() < 0.45;
      const willDecline = Math.random() < 0.07;

      const baseLine = (status: LogStatus): Omit<LogLine, 'id'> => ({
        timestamp: PaymentSimulationService.nowStamp(),
        status, amount, cardLast4, brand, merchant, txnId,
      });

      this.appendLine(baseLine('init'));
      await PaymentSimulationService.wait(180 + Math.random() * 220);

      this.appendLine(baseLine('auth'));
      await PaymentSimulationService.wait(120 + Math.random() * 280);

      if (requires3DS) {
        this.appendLine(baseLine('3ds'));
        await PaymentSimulationService.wait(380 + Math.random() * 420);
      }

      this.totalToday += 1;
      if (willDecline) {
        this.appendLine(baseLine('declined'));
      } else {
        this.successCount += 1;
        this.appendLine(baseLine('approved'));
      }
    },

    /** Self-perpetuating loop while `isRunning` stays true. */
    async runLoop(): Promise<void> {
      if (!this.isRunning) return;
      await this.simulateCharge();
      if (this.isRunning) {
        await PaymentSimulationService.wait(400 + Math.random() * 600);
        void this.runLoop();
      }
    },
  },
});
