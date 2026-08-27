import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchWorkQueueCase, fetchWorkQueueCases } from './work-queue-api';
import { buildWorkQueueSearchParams, filterAndSortMockCases } from './work-queue-query';

describe('buildWorkQueueSearchParams', () => {
  it('omits all filters and includes concrete filters', () => {
    const params = buildWorkQueueSearchParams({
      role: 'care-coordinator',
      sortBy: 'nextFollowUpDate',
      status: 'all',
    });

    expect(params.toString()).toBe('role=care-coordinator&sortBy=nextFollowUpDate');
  });
});

describe('filterAndSortMockCases', () => {
  it('filters explicit mock data by role and status', () => {
    const result = filterAndSortMockCases(
      [
        {
          id: 'case-2',
          assignedTeam: [{ name: 'Alex Kim', role: 'peer-support' }],
          clientAlias: 'Sage M.',
          context: 'Follow-up',
          lastContactDate: '2026-08-22',
          nextFollowUpDate: '2026-08-26',
          status: 'scheduled',
          urgency: 'routine',
        },
        {
          id: 'case-1',
          assignedTeam: [{ name: 'Mina Patel', role: 'care-coordinator' }],
          clientAlias: 'River H.',
          context: 'Follow-up',
          lastContactDate: '2026-08-20',
          nextFollowUpDate: '2026-08-24',
          status: 'overdue',
          urgency: 'urgent',
        },
      ],
      { role: 'care-coordinator', status: 'overdue' },
    );

    expect(result.map((item) => item.id)).toEqual(['case-1']);
  });
});

describe('fetchWorkQueueCases', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the backend API in normal mode', async () => {
    vi.stubEnv('EXPO_PUBLIC_API_URL', 'https://api.example.test/');
    vi.stubEnv('EXPO_PUBLIC_USE_MOCK_DATA', 'false');

    const fetcher = vi.fn(async () => ({
      ok: true,
      json: async () => ({ data: [] }),
      status: 200,
    })) as unknown as typeof fetch;

    await expect(fetchWorkQueueCases({ status: 'overdue' }, fetcher)).resolves.toEqual([]);
    expect(fetcher).toHaveBeenCalledWith('https://api.example.test/api/cases?status=overdue', {
      headers: {
        Accept: 'application/json',
      },
    });
  });

  it('does not fall back to mock data when the backend fails', async () => {
    vi.stubEnv('EXPO_PUBLIC_API_URL', 'https://api.example.test');
    vi.stubEnv('EXPO_PUBLIC_USE_MOCK_DATA', 'false');

    const fetcher = vi.fn(async () => ({
      ok: false,
      json: async () => ({}),
      status: 503,
    })) as unknown as typeof fetch;

    await expect(fetchWorkQueueCases({}, fetcher)).rejects.toThrow(
      'Work queue request failed with status 503',
    );
  });

  it('requires explicit mock mode for local synthetic data', async () => {
    vi.stubEnv('EXPO_PUBLIC_USE_MOCK_DATA', 'true');

    await expect(fetchWorkQueueCases({ status: 'overdue' })).resolves.toHaveLength(2);
  });
});

describe('fetchWorkQueueCase', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('loads one case from the backend API', async () => {
    vi.stubEnv('EXPO_PUBLIC_API_URL', 'https://api.example.test/');
    vi.stubEnv('EXPO_PUBLIC_USE_MOCK_DATA', 'false');

    const fetcher = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        data: {
          id: 'case-001',
          assignedTeam: [{ name: 'Mina Patel', role: 'care-coordinator' }],
          clientAlias: 'River H.',
          context: 'Follow-up detail',
          lastContactDate: '2026-08-20',
          nextFollowUpDate: '2026-08-24',
          status: 'overdue',
          urgency: 'urgent',
        },
      }),
      status: 200,
    })) as unknown as typeof fetch;

    await expect(fetchWorkQueueCase('case-001', fetcher)).resolves.toMatchObject({
      id: 'case-001',
      clientAlias: 'River H.',
    });
    expect(fetcher).toHaveBeenCalledWith('https://api.example.test/api/cases/case-001', {
      headers: {
        Accept: 'application/json',
      },
    });
  });

  it('returns a specific error when the backend reports not found', async () => {
    vi.stubEnv('EXPO_PUBLIC_API_URL', 'https://api.example.test');
    vi.stubEnv('EXPO_PUBLIC_USE_MOCK_DATA', 'false');

    const fetcher = vi.fn(async () => ({
      ok: false,
      json: async () => ({}),
      status: 404,
    })) as unknown as typeof fetch;

    await expect(fetchWorkQueueCase('missing-case', fetcher)).rejects.toThrow(
      'Work queue case missing-case was not found.',
    );
  });

  it('does not fall back to mock data when the detail request fails', async () => {
    vi.stubEnv('EXPO_PUBLIC_API_URL', 'https://api.example.test');
    vi.stubEnv('EXPO_PUBLIC_USE_MOCK_DATA', 'false');

    const fetcher = vi.fn(async () => ({
      ok: false,
      json: async () => ({}),
      status: 503,
    })) as unknown as typeof fetch;

    await expect(fetchWorkQueueCase('case-001', fetcher)).rejects.toThrow(
      'Work queue case request failed with status 503',
    );
  });
});
