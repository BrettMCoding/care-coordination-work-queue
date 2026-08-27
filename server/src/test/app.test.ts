import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app';
import { WorkQueueService } from '../features/work-queue/work-queue-service';
import type { WorkQueueCase } from '../features/work-queue/work-queue-types';

describe('server app', () => {
  const demoCase: WorkQueueCase = {
    id: 'case-001',
    clientAlias: 'River H.',
    context: 'Needs follow-up after missed intake paperwork.',
    assignedTeam: [
      { name: 'Mina Patel', role: 'care-coordinator' },
      { name: 'Jon Bell', role: 'team-lead' },
    ],
    lastContactDate: '2026-08-20',
    nextFollowUpDate: '2026-08-24',
    status: 'overdue',
    urgency: 'urgent',
  };

  it('returns health status with a request id', async () => {
    const response = await request(createApp()).get('/healthz').expect(200);

    expect(response.headers['x-request-id']).toBeTruthy();
    expect(response.body).toMatchObject({
      status: 'ok',
      service: 'care-coordination-work-queue-api',
    });
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('preserves an incoming request id', async () => {
    const response = await request(createApp())
      .get('/healthz')
      .set('x-request-id', 'demo-request-id')
      .expect(200);

    expect(response.headers['x-request-id']).toBe('demo-request-id');
  });

  it('returns readiness when the database check succeeds', async () => {
    const response = await request(
      createApp({ readinessCheck: async () => undefined }),
    )
      .get('/readyz')
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'ready',
      service: 'care-coordination-work-queue-api',
    });
  });

  it('returns a consistent readiness error when the database check fails', async () => {
    const response = await request(
      createApp({
        readinessCheck: async () => {
          throw new Error('database unavailable');
        },
      }),
    )
      .get('/readyz')
      .set('x-request-id', 'readyz-test')
      .expect(503);

    expect(response.body.error).toMatchObject({
      code: 'DATABASE_NOT_READY',
      message: 'Database connectivity check failed.',
      requestId: 'readyz-test',
    });
  });

  it('returns a consistent JSON error for unknown routes', async () => {
    const response = await request(createApp())
      .get('/missing')
      .set('x-request-id', 'missing-route-test')
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'No route found for GET /missing',
        requestId: 'missing-route-test',
      },
    });
  });

  it('lists work queue cases through the injected service', async () => {
    const service = new WorkQueueService({
      findCaseById: async () => demoCase,
      listCases: async (query) => {
        expect(query).toMatchObject({
          role: 'care-coordinator',
          sortBy: 'nextFollowUpDate',
          sortDirection: 'asc',
          status: 'overdue',
        });

        return [demoCase];
      },
    });

    const response = await request(
      createApp({ workQueueServiceFactory: async () => service }),
    )
      .get('/api/cases?status=overdue&role=care-coordinator')
      .expect(200);

    expect(response.body).toMatchObject({
      data: [demoCase],
      meta: {
        count: 1,
        filters: {
          role: 'care-coordinator',
          status: 'overdue',
        },
      },
    });
  });

  it('returns validation details for invalid case filters', async () => {
    const response = await request(createApp())
      .get('/api/cases?status=not-a-status')
      .set('x-request-id', 'invalid-filter-test')
      .expect(400);

    expect(response.body.error).toMatchObject({
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed.',
      requestId: 'invalid-filter-test',
    });
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['status'],
        }),
      ]),
    );
  });

  it('returns a work queue case detail by id', async () => {
    const service = new WorkQueueService({
      findCaseById: async (id) => {
        expect(id).toBe('case-001');
        return demoCase;
      },
      listCases: async () => [],
    });

    const response = await request(
      createApp({ workQueueServiceFactory: async () => service }),
    )
      .get('/api/cases/case-001')
      .expect(200);

    expect(response.body).toEqual({ data: demoCase });
  });
});
