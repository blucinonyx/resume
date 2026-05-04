// ApprovalFlow — a single document moving through the four-stage chain.
export interface ApprovalToken {
  id: number;
  stage: number;
  bornAt: number;
}

// PageSpeedDash — a labelled performance metric (FCP / LCP / etc).
export interface PageSpeedMetric {
  key: string;
  value: string;
}
