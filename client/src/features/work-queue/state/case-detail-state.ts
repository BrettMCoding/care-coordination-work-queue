import type { WorkQueueCase } from '@/features/work-queue/types';

export type CaseDetailState =
  | { kind: 'closed' }
  | { caseId: string; kind: 'loading'; requestKey: number }
  | { caseId: string; caseItem: WorkQueueCase; kind: 'ready'; requestKey: number }
  | { caseId: string; kind: 'error'; message: string; requestKey: number };

export type CaseDetailAction =
  | { caseId: string; type: 'open' }
  | { type: 'close' }
  | { type: 'retry' }
  | { caseId: string; caseItem: WorkQueueCase; type: 'loaded' }
  | { caseId: string; message: string; type: 'failed' };

export const initialCaseDetailState: CaseDetailState = { kind: 'closed' };

export function caseDetailReducer(
  state: CaseDetailState,
  action: CaseDetailAction,
): CaseDetailState {
  switch (action.type) {
    case 'open':
      return { caseId: action.caseId, kind: 'loading', requestKey: 0 };
    case 'close':
      return initialCaseDetailState;
    case 'retry':
      if (state.kind === 'closed') {
        return state;
      }

      return {
        caseId: state.caseId,
        kind: 'loading',
        requestKey: state.requestKey + 1,
      };
    case 'loaded':
      if (state.kind === 'closed' || state.caseId !== action.caseId) {
        return state;
      }

      return {
        caseId: action.caseId,
        caseItem: action.caseItem,
        kind: 'ready',
        requestKey: state.requestKey,
      };
    case 'failed':
      if (state.kind === 'closed' || state.caseId !== action.caseId) {
        return state;
      }

      return {
        caseId: action.caseId,
        kind: 'error',
        message: action.message,
        requestKey: state.requestKey,
      };
  }
}
