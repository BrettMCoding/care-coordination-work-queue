import { describe, expect, it } from 'vitest';

import { applyRollingCaseDates } from '../features/work-queue/work-queue-rolling-dates';
import type { WorkQueueCase } from '../features/work-queue/work-queue-types';

const baseCase: WorkQueueCase = {
  id: 'case-002',
  assignedTeam: [{ name: 'Theo Nguyen', role: 'care-coordinator' }],
  clientAlias: 'Sage M.',
  context: 'Check whether transportation support details were received.',
  lastContactDate: '2020-01-01',
  nextFollowUpDate: '2020-01-02',
  status: 'due-soon',
  urgency: 'elevated',
};

describe('applyRollingCaseDates', () => {
  it('keeps due-soon case dates relative to the current day', () => {
    expect(applyRollingCaseDates(baseCase, new Date('2026-08-28T12:00:00')).nextFollowUpDate).toBe(
      '2026-08-29',
    );
  });

  it('keeps overdue urgent case dates in the past', () => {
    const result = applyRollingCaseDates(
      { ...baseCase, id: 'case-001', status: 'overdue', urgency: 'urgent' },
      new Date('2026-08-28T12:00:00'),
    );

    expect(result).toMatchObject({
      lastContactDate: '2026-08-20',
      nextFollowUpDate: '2026-08-26',
      status: 'overdue',
      urgency: 'urgent',
    });
  });
});
