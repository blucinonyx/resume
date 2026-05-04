import type { ApprovalToken } from '../interface/MedServiceTypes';

const STAGE_DURATION_MS = 900;
const FINAL_STAGE = 3;
const ARCHIVE_HOLD_MS = 3500;
const SPAWN_PROB = 0.018;
const MAX_TOKENS = 6;

export interface ApprovalTickResult {
  tokens: ApprovalToken[];
  archived: number;
}

export class ApprovalFlowService {
  /**
   * Advance the chain by one rAF tick. Optionally spawns a new token,
   * walks every existing token to its current stage, and drops anything
   * past the archive hold time. Returns the new token list plus how many
   * just got archived this frame (for the running counter).
   */
  static advance(
    tokens: readonly ApprovalToken[],
    now: number,
    nextId: () => number,
  ): ApprovalTickResult {
    let working: ApprovalToken[] = [...tokens];

    if (Math.random() < SPAWN_PROB && working.length < MAX_TOKENS) {
      working = [...working, { id: nextId(), stage: 0, bornAt: now }];
    }

    working = working.map((tk) => ({
      ...tk,
      stage: Math.min(FINAL_STAGE, Math.floor((now - tk.bornAt) / STAGE_DURATION_MS)),
    }));

    let archived = 0;
    working = working.filter((tk) => {
      if (tk.stage === FINAL_STAGE && now - tk.bornAt > ARCHIVE_HOLD_MS) {
        archived += 1;
        return false;
      }
      return true;
    });

    return { tokens: working, archived };
  }
}
