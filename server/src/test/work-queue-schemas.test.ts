import { describe, expect, it } from 'vitest';

import { caseListQuerySchema } from '../features/work-queue/work-queue-schemas';

describe('caseListQuerySchema', () => {
  it('defaults sort options', () => {
    expect(caseListQuerySchema.parse({ status: 'overdue' })).toEqual({
      sortBy: 'nextFollowUpDate',
      sortDirection: 'asc',
      status: 'overdue',
    });
  });

  it('rejects unknown statuses', () => {
    expect(() => caseListQuerySchema.parse({ status: 'unknown' })).toThrow();
  });
});
