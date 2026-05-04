export type RoofKind = 'arched' | 'single' | 'double';
export type MaterialKey = 'monolithic' | 'profiled' | 'honeycomb';
export type EdgeColor = 'slope1' | 'length1' | 'slope2' | 'length2';

export interface Material {
  key: MaterialKey;
  pricePerM2: number; // ₴
  colorOptions: string[];
  sizeOptions: string[];
  defaultColor: string;
  defaultSize: string;
}

export interface Selection {
  color: string;
  size: string;
}

export interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: EdgeColor;
}

export interface Face {
  points: string;
  depth?: number;
  tone?: 'top' | 'side' | 'bottom';
}

export interface RoofGeo {
  faces: Face[];
  edges: Edge[];
  archPath: string | null;
  archFrontPolyline: string | null;
  archBackPolyline: string | null;
}

export interface RoofDimensions {
  a1: number;
  d1: number;
  a2: number;
  d2: number;
}
