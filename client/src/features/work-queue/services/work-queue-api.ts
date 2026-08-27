import { syntheticCases } from '@/features/work-queue/data/synthetic-cases';
import type { WorkQueueCase } from '@/features/work-queue/types';

import {
  buildWorkQueueSearchParams,
  filterAndSortMockCases,
  type WorkQueueQuery,
} from './work-queue-query';

type WorkQueueListResponse = {
  data: WorkQueueCase[];
};

export async function fetchWorkQueueCases(query: WorkQueueQuery, fetcher = fetch) {
  if (isMockModeEnabled()) {
    return filterAndSortMockCases(syntheticCases, query);
  }

  const apiUrl = getApiUrl();
  const params = buildWorkQueueSearchParams(query);
  const requestUrl = `${apiUrl}/api/cases${params.size > 0 ? `?${params.toString()}` : ''}`;
  const response = await fetcher(requestUrl, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Work queue request failed with status ${response.status}`);
  }

  const body = (await response.json()) as WorkQueueListResponse;

  if (!Array.isArray(body.data)) {
    throw new Error('Work queue response did not include a data array.');
  }

  return body.data;
}

function getApiUrl() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (!apiUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is required unless EXPO_PUBLIC_USE_MOCK_DATA=true.');
  }

  return apiUrl.replace(/\/$/, '');
}

function isMockModeEnabled() {
  return process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true';
}
