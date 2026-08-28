import type { WorkQueueCase } from '@/features/work-queue/types';

type RollingCaseOffset = {
  lastContactOffsetDays: number;
  nextFollowUpOffsetDays: number;
};

const rollingCaseOffsets: Record<string, RollingCaseOffset> = {
  'case-001': { lastContactOffsetDays: -8, nextFollowUpOffsetDays: -2 },
  'case-002': { lastContactOffsetDays: -3, nextFollowUpOffsetDays: 1 },
  'case-003': { lastContactOffsetDays: -7, nextFollowUpOffsetDays: 5 },
  'case-004': { lastContactOffsetDays: -4, nextFollowUpOffsetDays: 2 },
  'case-005': { lastContactOffsetDays: -9, nextFollowUpOffsetDays: -1 },
  'case-006': { lastContactOffsetDays: -2, nextFollowUpOffsetDays: 3 },
};

export function applyRollingCaseDates(caseItem: WorkQueueCase, today = new Date()): WorkQueueCase {
  const offsets = rollingCaseOffsets[caseItem.id];

  if (!offsets) {
    return caseItem;
  }

  return {
    ...caseItem,
    lastContactDate: formatDateWithOffset(today, offsets.lastContactOffsetDays),
    nextFollowUpDate: formatDateWithOffset(today, offsets.nextFollowUpOffsetDays),
  };
}

function formatDateWithOffset(today: Date, offsetDays: number) {
  const date = new Date(today);

  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
