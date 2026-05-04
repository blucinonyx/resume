import type { KoshelokBundle } from '../../types';

export const koshelok: KoshelokBundle = Object.freeze({
  label: 'Wallet · Laravel + Vue prototype',
  cardLbl: 'KoshelOK Wallet',
  bal: 'Available balance',
  tx: 'Recent activity',
  sources: Object.freeze(['salary deposit', 'utility payment', 'transfer in', 'cashback', 'top-up']),
  note: 'Built the Laravel backend + Vue dashboard for the new product. Brief tenure (4 months) but the architecture pattern carried forward.',
  currency: 'UAH',
});
