import type { Tx } from '../interface/WalletTypes';

const MIN_BALANCE = 1000;
const HISTORY_SIZE = 5;
const INCOMING_PROB = 0.45;
const AMOUNT_BASE = 50;
const AMOUNT_RANGE = 1500;

export interface WalletTickResult {
  tx: Tx;
  newBalance: number;
}

export class WalletService {
  /**
   * Generate one random ledger entry, biased toward outgoing payments,
   * picking the human label from the localised `sources` list. Returns
   * both the new transaction and the balance after it's applied.
   */
  static randomTick(
    sources: readonly string[],
    balance: number,
    nextId: () => number,
  ): WalletTickResult {
    const isIn = Math.random() < INCOMING_PROB;
    const label = sources[Math.floor(Math.random() * sources.length)];
    const amount = (isIn ? 1 : -1) * (AMOUNT_BASE + Math.round(Math.random() * AMOUNT_RANGE));
    const kind: Tx['kind'] = isIn ? 'in' : 'out';
    return {
      tx: { id: nextId(), label, amount, kind },
      newBalance: Math.max(MIN_BALANCE, balance + amount),
    };
  }

  /** Prepend a new tx and trim the visible history. */
  static prepend(history: readonly Tx[], tx: Tx): Tx[] {
    return [tx, ...history].slice(0, HISTORY_SIZE);
  }
}
