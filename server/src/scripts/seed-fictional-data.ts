import { getDatabase, closeMongoConnection } from '../database/mongo';
import { logger } from '../logging/logger';
import { fictionalCases } from '../features/work-queue/work-queue-fictional-data';
import { WorkQueueRepository } from '../features/work-queue/work-queue-repository';
import type { WorkQueueCaseDocument } from '../features/work-queue/work-queue-types';

async function main() {
  const db = await getDatabase();
  const repository = new WorkQueueRepository(db.collection<WorkQueueCaseDocument>('workQueueCases'));

  await repository.ensureIndexes();
  const result = await repository.upsertFictionalCases(fictionalCases);

  logger.info(
    {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    },
    'Fictional work queue seed completed',
  );
}

main()
  .catch((error: unknown) => {
    logger.error({ error }, 'Fictional seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongoConnection();
  });
