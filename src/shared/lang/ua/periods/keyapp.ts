import type { KeyappBundle } from '../../types';

export const keyapp: KeyappBundle = Object.freeze({
  title: 'Симулятор пайплайну · live',
  counterLbl: 'подій оброблено сьогодні · ціль 124М',
  eps: 'подій/сек',
  p99: 'p99',
  backp: 'тиск',
  start: '▶ Старт',
  pause: '⏸ Пауза',
  reset: '⟲ Скинути',
  sourceN: 'events.source',
  queueN: 'RabbitMQ',
  workerN: 'Воркери',
  sinkN: 'ClickHouse',
});
