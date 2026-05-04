import { describe, expect, it } from 'vitest';
import { MATERIALS, RoofGeometryService } from '../RoofGeometryService';
import type { RoofDimensions } from '../../interface/RoofTypes';

const dims: RoofDimensions = { a1: 4000, d1: 6000, a2: 4000, d2: 6000 };

describe('RoofGeometryService.areaM2', () => {
  it('computes single-slope area as a1 * d1 (in metres)', () => {
    expect(RoofGeometryService.areaM2('single', dims)).toBe(24);
  });
  it('adds both slabs for double-slope', () => {
    expect(RoofGeometryService.areaM2('double', dims)).toBe(48);
  });
  it('applies the arch correction factor', () => {
    // a1m * d1m * 1.4 = 4 * 6 * 1.4 = 33.6
    expect(RoofGeometryService.areaM2('arched', dims)).toBe(33.6);
  });
});

describe('RoofGeometryService.priceFor', () => {
  it('multiplies price-per-m2 by area, rounded to 2dp', () => {
    const monolithic = MATERIALS[0];
    expect(RoofGeometryService.priceFor(monolithic, 24)).toBe(25_800);
  });
});

describe('RoofGeometryService.formatPrice', () => {
  it('renders 2dp en-US formatted', () => {
    expect(RoofGeometryService.formatPrice(25_800)).toBe('25,800.00');
  });
});

describe('RoofGeometryService.build', () => {
  it('produces 5 painter-sorted faces and 4 edges for single-slope', () => {
    const geo = RoofGeometryService.build('single', dims, 0);
    expect(geo.faces).toHaveLength(5);
    expect(geo.edges).toHaveLength(4);
    expect(geo.archPath).toBeNull();
  });
  it('produces 5 faces and 6 edges for double-slope', () => {
    const geo = RoofGeometryService.build('double', dims, 0);
    expect(geo.faces).toHaveLength(5);
    expect(geo.edges).toHaveLength(6);
    expect(geo.archPath).toBeNull();
  });
  it('produces 3 faces, 2 edges, and a closed arch path for arched', () => {
    const geo = RoofGeometryService.build('arched', dims, 0);
    expect(geo.faces).toHaveLength(3);
    expect(geo.edges).toHaveLength(2);
    expect(geo.archPath).not.toBeNull();
    expect(geo.archPath?.endsWith('Z')).toBe(true);
  });
});

describe('RoofGeometryService.thumbStyle', () => {
  it('returns a backgroundImage for monolithic', () => {
    const m = MATERIALS.find((x) => x.key === 'monolithic')!;
    const s = RoofGeometryService.thumbStyle(m, 'transparent');
    expect(s.backgroundImage).toContain('linear-gradient');
  });
  it('returns a horizontal repeating gradient for profiled', () => {
    const m = MATERIALS.find((x) => x.key === 'profiled')!;
    const s = RoofGeometryService.thumbStyle(m, 'bronze');
    expect(s.background).toContain('repeating-linear-gradient(90deg');
  });
  it('returns a vertical repeating gradient for honeycomb', () => {
    const m = MATERIALS.find((x) => x.key === 'honeycomb')!;
    const s = RoofGeometryService.thumbStyle(m, 'graphite');
    expect(s.background).toContain('repeating-linear-gradient(0deg');
  });
});
