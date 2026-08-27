import type { WorkQueueCase, WorkQueueCaseDocument } from './work-queue-types';

export function mapCaseDocument(document: WorkQueueCaseDocument): WorkQueueCase {
  return {
    id: document._id,
    assignedTeam: document.assignedTeam,
    clientAlias: document.clientAlias,
    context: document.context,
    lastContactDate: document.lastContactDate,
    nextFollowUpDate: document.nextFollowUpDate,
    status: document.status,
    urgency: document.urgency,
  };
}
