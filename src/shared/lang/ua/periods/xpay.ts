import type { XpayBundle } from '../../types';

export const xpay: XpayBundle = Object.freeze({
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
});
