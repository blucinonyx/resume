// Public types for the Keyapp ingestion-pipeline simulator. Kept separate
// from the implementation (services/IngestionSimulator.ts) so other modules
// can `import type` without pulling the simulator class in.

export interface SimTick {
  t: number;
  eventsPerSec: number;
  totalToday: number;
  bufferDepth: number;
  p99: number;
  backpressurePct: number;
}

export interface SimConfig {
  tickIntervalMs: number;
  targetEventsPerSec: number;
  rampSeconds: number;
  startingTotal: number;
}
