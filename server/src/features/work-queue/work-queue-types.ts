export const careTeamRoles = ['care-coordinator', 'clinician', 'peer-support', 'team-lead'] as const;
export const followUpStatuses = ['overdue', 'due-soon', 'scheduled', 'waiting', 'completed'] as const;
export const urgencyLevels = ['routine', 'elevated', 'urgent'] as const;
export const caseSortFields = ['clientAlias', 'lastContactDate', 'nextFollowUpDate', 'status', 'urgency'] as const;

export type CareTeamRole = (typeof careTeamRoles)[number];
export type FollowUpStatus = (typeof followUpStatuses)[number];
export type Urgency = (typeof urgencyLevels)[number];
export type CaseSortField = (typeof caseSortFields)[number];
export type SortDirection = 'asc' | 'desc';

export type CareTeamMember = {
  name: string;
  role: CareTeamRole;
};

export type WorkQueueCase = {
  id: string;
  clientAlias: string;
  context: string;
  assignedTeam: CareTeamMember[];
  lastContactDate: string;
  nextFollowUpDate: string;
  status: FollowUpStatus;
  urgency: Urgency;
};

export type WorkQueueCaseDocument = Omit<WorkQueueCase, 'id'> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CaseListQuery = {
  role?: CareTeamRole;
  search?: string;
  sortBy: CaseSortField;
  sortDirection: SortDirection;
  status?: FollowUpStatus;
  urgency?: Urgency;
};
