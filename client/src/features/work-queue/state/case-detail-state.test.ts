import { describe, expect, it } from 'vitest';

import {
  caseDetailReducer,
  initialCaseDetailState,
  type CaseDetailState,
} from './case-detail-state';
import type { WorkQueueCase } from '@/features/work-queue/types';

const demoCase: WorkQueueCase = {
  id: 'case-001',
  assignedTeam: [{ name: 'Mina Patel', role: 'care-coordinator' }],
  clientAlias: 'River H.',
  context: 'Needs follow-up after missed intake paperwork.',
  lastContactDate: '2026-08-20',
  nextFollowUpDate: '2026-08-24',
  status: 'overdue',
  urgency: 'urgent',
};

describe('caseDetailReducer', () => {
  it('opens a selected case in loading state', () => {
    expect(caseDetailReducer(initialCaseDetailState, { caseId: 'case-001', type: 'open' })).toEqual(
      {
        caseId: 'case-001',
        kind: 'loading',
        requestKey: 0,
      },
    );
  });

  it('stores loaded detail data for the current selected case', () => {
    const state = caseDetailReducer(initialCaseDetailState, {
      caseId: 'case-001',
      type: 'open',
    });

    expect(
      caseDetailReducer(state, {
        caseId: 'case-001',
        caseItem: demoCase,
        type: 'loaded',
      }),
    ).toEqual({
      caseId: 'case-001',
      caseItem: demoCase,
      kind: 'ready',
      requestKey: 0,
    });
  });

  it('supports retry after a failed detail load', () => {
    const errorState: CaseDetailState = {
      caseId: 'case-001',
      kind: 'error',
      message: 'Unable to load case details.',
      requestKey: 0,
    };

    expect(caseDetailReducer(errorState, { type: 'retry' })).toEqual({
      caseId: 'case-001',
      kind: 'loading',
      requestKey: 1,
    });
  });

  it('closes the detail modal and ignores stale responses', () => {
    const closedState = caseDetailReducer(
      {
        caseId: 'case-001',
        kind: 'loading',
        requestKey: 0,
      },
      { type: 'close' },
    );

    expect(closedState).toEqual(initialCaseDetailState);
    expect(
      caseDetailReducer(closedState, {
        caseId: 'case-001',
        caseItem: demoCase,
        type: 'loaded',
      }),
    ).toEqual(initialCaseDetailState);
  });
});
