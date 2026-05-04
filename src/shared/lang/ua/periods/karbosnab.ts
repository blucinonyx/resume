import type { KarbosnabBundle } from '../../types';

export const karbosnab: KarbosnabBundle = Object.freeze({
  title: 'Розрахунок покрівлі',
  kinds: Object.freeze({
    arched: 'Арочний навіс',
    single: 'Односкатний навіс',
    double: 'Двоскатний навіс',
  }),
  sectionLeft: 'Індивідуальний прорахунок',
  sectionRight: 'Варіанти реалізації',
  sizesLbl: 'Розміри:',
  slope: 'Скат',
  length: 'Довжина',
  calc: 'Розрахувати',
  materials: Object.freeze({
    monolithic: 'Монолітний полікарбонат',
    profiled: 'Профільований полікарбонат',
    honeycomb: 'Сотовий полікарбонат',
  }),
  color: 'колір',
  size: 'опція',
  mm: 'мм',
  currency: 'грн',
});
