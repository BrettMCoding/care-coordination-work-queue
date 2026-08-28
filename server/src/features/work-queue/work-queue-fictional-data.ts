import type { WorkQueueCase } from './work-queue-types';

import { applyRollingCaseDates } from './work-queue-rolling-dates';

const fictionalCaseTemplates: WorkQueueCase[] = [
  {
    id: 'case-001',
    clientAlias: 'River H.',
    context: 'Needs follow-up after missed intake paperwork.',
    assignedTeam: [
      { name: 'Mina Patel', role: 'care-coordinator' },
      { name: 'Jon Bell', role: 'team-lead' },
    ],
    lastContactDate: '',
    nextFollowUpDate: '',
    status: 'overdue',
    urgency: 'urgent',
  },
  {
    id: 'case-002',
    clientAlias: 'Sage M.',
    context: 'Check whether transportation support details were received.',
    assignedTeam: [
      { name: 'Theo Nguyen', role: 'care-coordinator' },
      { name: 'Alex Kim', role: 'peer-support' },
    ],
    lastContactDate: '',
    nextFollowUpDate: '',
    status: 'due-soon',
    urgency: 'elevated',
  },
  {
    id: 'case-003',
    clientAlias: 'Rowan C.',
    context: 'Scheduled routine check-in after resource referral.',
    assignedTeam: [{ name: 'Ari Morgan', role: 'clinician' }],
    lastContactDate: '',
    nextFollowUpDate: '',
    status: 'scheduled',
    urgency: 'routine',
  },
  {
    id: 'case-004',
    clientAlias: 'Ellis T.',
    context: 'Waiting for consent form confirmation.',
    assignedTeam: [
      { name: 'Mina Patel', role: 'care-coordinator' },
      { name: 'Ari Morgan', role: 'clinician' },
    ],
    lastContactDate: '',
    nextFollowUpDate: '',
    status: 'waiting',
    urgency: 'elevated',
  },
  {
    id: 'case-005',
    clientAlias: 'Parker L.',
    context: 'Team lead review requested for ownership handoff.',
    assignedTeam: [
      { name: 'Jon Bell', role: 'team-lead' },
      { name: 'Theo Nguyen', role: 'care-coordinator' },
    ],
    lastContactDate: '',
    nextFollowUpDate: '',
    status: 'overdue',
    urgency: 'elevated',
  },
  {
    id: 'case-006',
    clientAlias: 'Quinn A.',
    context: 'Peer support follow-up scheduled after welcome call.',
    assignedTeam: [{ name: 'Alex Kim', role: 'peer-support' }],
    lastContactDate: '',
    nextFollowUpDate: '',
    status: 'scheduled',
    urgency: 'routine',
  },
];

export const fictionalCases = fictionalCaseTemplates.map((caseItem) =>
  applyRollingCaseDates(caseItem),
);
