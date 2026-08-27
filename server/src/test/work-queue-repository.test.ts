import { describe, expect, it } from 'vitest';

import { buildCaseMongoQuery, WorkQueueRepository } from '../features/work-queue/work-queue-repository';
import type { WorkQueueCaseDocument } from '../features/work-queue/work-queue-types';

const document: WorkQueueCaseDocument = {
  _id: 'case-001',
  assignedTeam: [{ name: 'Mina Patel', role: 'care-coordinator' }],
  clientAlias: 'River H.',
  context: 'Needs follow-up after missed intake paperwork.',
  createdAt: new Date('2026-08-01T00:00:00.000Z'),
  lastContactDate: '2026-08-20',
  nextFollowUpDate: '2026-08-24',
  status: 'overdue',
  updatedAt: new Date('2026-08-01T00:00:00.000Z'),
  urgency: 'urgent',
};

describe('buildCaseMongoQuery', () => {
  it('builds filters and sort for status and role', () => {
    const result = buildCaseMongoQuery({
      role: 'care-coordinator',
      sortBy: 'nextFollowUpDate',
      sortDirection: 'asc',
      status: 'overdue',
    });

    expect(result).toEqual({
      filter: {
        'assignedTeam.role': 'care-coordinator',
        status: 'overdue',
      },
      sort: {
        nextFollowUpDate: 1,
        _id: 1,
      },
    });
  });

  it('adds text search and descending sort when requested', () => {
    const result = buildCaseMongoQuery({
      search: 'transportation',
      sortBy: 'lastContactDate',
      sortDirection: 'desc',
    });

    expect(result).toEqual({
      filter: {
        $text: {
          $search: 'transportation',
        },
      },
      sort: {
        score: {
          $meta: 'textScore',
        },
        lastContactDate: -1,
        _id: 1,
      },
    });
  });
});

describe('WorkQueueRepository', () => {
  it('maps database documents to API cases without using a real database', async () => {
    const repository = new WorkQueueRepository({
      bulkWrite: async () => ({}) as never,
      createIndexes: async () => [],
      find: () =>
        ({
          sort: () => ({
            toArray: async () => [document],
          }),
        }) as never,
      findOne: async () => document,
    });

    await expect(
      repository.listCases({
        sortBy: 'nextFollowUpDate',
        sortDirection: 'asc',
      }),
    ).resolves.toEqual([
      {
        id: 'case-001',
        assignedTeam: document.assignedTeam,
        clientAlias: 'River H.',
        context: document.context,
        lastContactDate: document.lastContactDate,
        nextFollowUpDate: document.nextFollowUpDate,
        status: 'overdue',
        urgency: 'urgent',
      },
    ]);

    await expect(repository.findCaseById('case-001')).resolves.toMatchObject({
      id: 'case-001',
    });
  });
});
