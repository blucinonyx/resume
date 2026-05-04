import type { XpayBundle } from '../../types';

export const xpay: XpayBundle = Object.freeze({
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
});
