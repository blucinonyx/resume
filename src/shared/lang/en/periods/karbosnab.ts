import type { KarbosnabBundle } from '../../types';

export const karbosnab: KarbosnabBundle = Object.freeze({
  title: 'Roof calculation',
  kinds: Object.freeze({
    arched: 'Arched canopy',
    single: 'Single-slope',
    double: 'Double-slope',
  }),
  sectionLeft: 'Individual calculation',
  sectionRight: 'Implementation variants',
  sizesLbl: 'Dimensions:',
  slope: 'Slope',
  length: 'Length',
  calc: 'Calculate',
  materials: Object.freeze({
    monolithic: 'Monolithic polycarbonate',
    profiled: 'Profiled polycarbonate',
    honeycomb: 'Cellular polycarbonate',
  }),
  color: 'colour',
  size: 'option',
  mm: 'mm',
  currency: 'UAH',
});
