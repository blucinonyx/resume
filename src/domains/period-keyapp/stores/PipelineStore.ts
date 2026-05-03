import { defineStore } from 'pinia';
import { IngestionSimulator, type SimTick } from '../services/IngestionSimulator';

const HISTORY_SIZE = 60;

interface PipelineState {
  isRunning: boolean;
  history: SimTick[];
  current: SimTick | null;
  intervalId: number | null;
}

export const usePipelineStore = defineStore('pipeline', {
  state: (): PipelineState => ({
    isRunning: false,
    history: [],
    current: null,
    intervalId: null,
  }),

  getters: {
    sparkValues(state): number[] {
      return state.history.map((t) => t.eventsPerSec);
    },
    totalToday(state): number {
      return state.current?.totalToday ?? 87_342_000;
    },
    eventsPerSec(state): number {
      return state.current?.eventsPerSec ?? 0;
    },
  },

  actions: {
    start(): void {
      if (this.isRunning) return;
      const sim = new IngestionSimulator();
      this.isRunning = true;
      const tick = (): void => {
        const next = sim.next();
        this.current = next;
        const updated = [...this.history, next];
        this.history = updated.length > HISTORY_SIZE ? updated.slice(-HISTORY_SIZE) : updated;
      };
      tick();
      const id = window.setInterval(tick, 250);
      this.intervalId = id;
    },

    pause(): void {
      if (this.intervalId !== null) {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.isRunning = false;
    },

    reset(): void {
      this.pause();
      this.history = [];
      this.current = null;
    },
  },
});
