import { getDatabase } from '../../database/mongo';
import { HttpError } from '../../errors/http-error';

import { WorkQueueRepository } from './work-queue-repository';
import type { CaseListQuery, WorkQueueCaseDocument } from './work-queue-types';

export type WorkQueueReader = Pick<WorkQueueRepository, 'findCaseById' | 'listCases'>;

export class WorkQueueService {
  constructor(private readonly repository: WorkQueueReader) {}

  listCases(query: CaseListQuery) {
    return this.repository.listCases(query);
  }

  async getCaseById(id: string) {
    const item = await this.repository.findCaseById(id);

    if (!item) {
      throw new HttpError(404, 'CASE_NOT_FOUND', 'Work queue case was not found.');
    }

    return item;
  }
}

export async function createWorkQueueService() {
  const db = await getDatabase();
  const collection = db.collection<WorkQueueCaseDocument>('workQueueCases');

  return new WorkQueueService(new WorkQueueRepository(collection));
}
