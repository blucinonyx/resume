// One row in the recent-activity ticker.
export interface Tx {
  id: number;
  label: string;
  amount: number;
  kind: 'in' | 'out';
}
