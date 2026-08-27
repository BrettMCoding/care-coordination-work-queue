import type { BulkWriteResult, Collection, Filter, Sort } from 'mongodb';

import { mapCaseDocument } from './work-queue-mappers';
import type { CaseListQuery, WorkQueueCase, WorkQueueCaseDocument } from './work-queue-types';

export type CaseCollection = Pick<
  Collection<WorkQueueCaseDocument>,
  'bulkWrite' | 'createIndexes' | 'find' | 'findOne'
>;

export class WorkQueueRepository {
  constructor(private readonly collection: CaseCollection) {}

  async ensureIndexes() {
    await this.collection.createIndexes([
      {
        key: { status: 1, nextFollowUpDate: 1 },
        name: 'status_next_follow_up',
      },
      {
        key: { 'assignedTeam.role': 1, nextFollowUpDate: 1 },
        name: 'assigned_role_next_follow_up',
      },
      {
        key: { urgency: 1, nextFollowUpDate: 1 },
        name: 'urgency_next_follow_up',
      },
      {
        key: {
          clientAlias: 'text',
          context: 'text',
          'assignedTeam.name': 'text',
        },
        name: 'case_search_text',
      },
    ]);
  }

  async listCases(query: CaseListQuery): Promise<WorkQueueCase[]> {
    const { filter, sort } = buildCaseMongoQuery(query);
    const documents = await this.collection.find(filter).sort(sort).toArray();

    return documents.map(mapCaseDocument);
  }

  async findCaseById(id: string): Promise<WorkQueueCase | null> {
    const document = await this.collection.findOne({ _id: id });

    return document ? mapCaseDocument(document) : null;
  }

  async upsertSyntheticCases(cases: WorkQueueCase[]): Promise<BulkWriteResult> {
    const now = new Date();

    return this.collection.bulkWrite(
      cases.map((item) => ({
        updateOne: {
          filter: { _id: item.id },
          update: {
            $set: {
              assignedTeam: item.assignedTeam,
              clientAlias: item.clientAlias,
              context: item.context,
              lastContactDate: item.lastContactDate,
              nextFollowUpDate: item.nextFollowUpDate,
              status: item.status,
              updatedAt: now,
              urgency: item.urgency,
            },
            $setOnInsert: {
              createdAt: now,
            },
          },
          upsert: true,
        },
      })),
      { ordered: true },
    );
  }
}

export function buildCaseMongoQuery(query: CaseListQuery): {
  filter: Filter<WorkQueueCaseDocument>;
  sort: Sort;
} {
  const filter: Filter<WorkQueueCaseDocument> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.role) {
    filter['assignedTeam.role'] = query.role;
  }

  if (query.urgency) {
    filter.urgency = query.urgency;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
  const sort: Sort = query.search
    ? { score: { $meta: 'textScore' }, [query.sortBy]: sortDirection, _id: 1 }
    : { [query.sortBy]: sortDirection, _id: 1 };

  return { filter, sort };
}
