import type { KoshelokBundle } from '../../types';

export const koshelok: KoshelokBundle = Object.freeze({
  label: 'Гаманець · Laravel + Vue prototype',
  cardLbl: 'KoshelOK Wallet',
  bal: 'Доступний баланс',
  tx: 'Остання активність',
  sources: Object.freeze(['зарплата', 'комунальні', 'переказ', 'кешбек', 'поповнення']),
  note: 'Будував Laravel-бекенд + Vue-дашборд для нового продукту. 4 місяці, але архітектурний патерн пішов далі.',
  currency: 'грн',
});
