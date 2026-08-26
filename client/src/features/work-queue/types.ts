export type CareTeamRole = 'care-coordinator' | 'clinician' | 'peer-support' | 'team-lead';

export type FollowUpStatus = 'overdue' | 'due-soon' | 'scheduled' | 'waiting' | 'completed';

export type QueueDemoState = 'ready' | 'loading' | 'empty' | 'error';

export type Urgency = 'routine' | 'elevated' | 'urgent';

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
