import type { CareTeamRole, FollowUpStatus, Urgency } from '@/features/work-queue/types';

export const roleLabels: Record<CareTeamRole, string> = {
  'care-coordinator': 'Care coordinator',
  clinician: 'Clinician',
  'peer-support': 'Peer support',
  'team-lead': 'Team lead',
};

export const statusLabels: Record<FollowUpStatus, string> = {
  overdue: 'Overdue',
  'due-soon': 'Due soon',
  scheduled: 'Scheduled',
  waiting: 'Waiting',
  completed: 'Completed',
};

export const urgencyLabels: Record<Urgency, string> = {
  routine: 'Routine',
  elevated: 'Elevated',
  urgent: 'Urgent',
};
