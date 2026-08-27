import { z } from 'zod';

import { careTeamRoles, caseSortFields, followUpStatuses, urgencyLevels } from './work-queue-types';

export const caseListQuerySchema = z.object({
  role: z.enum(careTeamRoles).optional(),
  search: z.string().trim().min(1).max(80).optional(),
  sortBy: z.enum(caseSortFields).default('nextFollowUpDate'),
  sortDirection: z.enum(['asc', 'desc']).default('asc'),
  status: z.enum(followUpStatuses).optional(),
  urgency: z.enum(urgencyLevels).optional(),
});

export const caseIdParamsSchema = z.object({
  id: z.string().trim().min(1).max(80),
});
