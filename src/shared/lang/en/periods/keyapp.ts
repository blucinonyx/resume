import type { KeyappBundle } from '../../types';

export const keyapp: KeyappBundle = Object.freeze({
  title: 'Pipeline simulator · live',
  counterLbl: 'events ingested today · target 124M',
  eps: 'events/sec',
  p99: 'p99',
  backp: 'backpressure',
  start: '▶ Start',
  pause: '⏸ Pause',
  reset: '⟲ Reset',
  sourceN: 'events.source',
  queueN: 'RabbitMQ',
  workerN: 'Workers',
  sinkN: 'ClickHouse',
});
