import type { CareTeamRole, FollowUpStatus, WorkQueueCase } from '@/features/work-queue/types';

export type StatusFilter = FollowUpStatus | 'all';
export type RoleFilter = CareTeamRole | 'all';
export type SortDirection = 'asc' | 'desc';
export type WorkQueueSortBy = 'clientAlias' | 'lastContactDate' | 'nextFollowUpDate' | 'status' | 'urgency';

export type WorkQueueQuery = {
  role?: RoleFilter;
  search?: string;
  sortBy?: WorkQueueSortBy;
  sortDirection?: SortDirection;
  status?: StatusFilter;
};

export function buildWorkQueueSearchParams(query: WorkQueueQuery) {
  const params = new URLSearchParams();

  appendFilter(params, 'role', query.role);
  appendFilter(params, 'status', query.status);
  appendOptional(params, 'search', query.search);
  appendOptional(params, 'sortBy', query.sortBy);
  appendOptional(params, 'sortDirection', query.sortDirection);

  return params;
}

export function filterAndSortMockCases(cases: WorkQueueCase[], query: WorkQueueQuery) {
  const filtered = cases.filter((item) => {
    const roleMatches =
      !query.role ||
      query.role === 'all' ||
      item.assignedTeam.some((member) => member.role === query.role);
    const statusMatches = !query.status || query.status === 'all' || item.status === query.status;
    const searchMatches = matchesSearch(item, query.search);

    return roleMatches && statusMatches && searchMatches;
  });

  const sortBy = query.sortBy ?? 'nextFollowUpDate';
  const direction = query.sortDirection === 'desc' ? -1 : 1;

  return [...filtered].sort((left, right) => {
    const leftValue = left[sortBy];
    const rightValue = right[sortBy];

    if (leftValue < rightValue) {
      return -1 * direction;
    }

    if (leftValue > rightValue) {
      return 1 * direction;
    }

    return left.id.localeCompare(right.id);
  });
}

function appendFilter(params: URLSearchParams, key: string, value: string | undefined) {
  if (!value || value === 'all') {
    return;
  }

  params.set(key, value);
}

function appendOptional(params: URLSearchParams, key: string, value: string | undefined) {
  const trimmed = value?.trim();

  if (trimmed) {
    params.set(key, trimmed);
  }
}

function matchesSearch(item: WorkQueueCase, search: string | undefined) {
  const trimmed = search?.trim().toLowerCase();

  if (!trimmed) {
    return true;
  }

  const searchableText = [
    item.clientAlias,
    item.context,
    ...item.assignedTeam.flatMap((member) => [member.name, member.role]),
  ]
    .join(' ')
    .toLowerCase();

  return searchableText.includes(trimmed);
}
