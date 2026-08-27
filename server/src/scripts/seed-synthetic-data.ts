import { getDatabase, closeMongoConnection } from '../database/mongo';
import { logger } from '../logging/logger';
import { syntheticCases } from '../features/work-queue/work-queue-seed-data';
import { WorkQueueRepository } from '../features/work-queue/work-queue-repository';
import type { WorkQueueCaseDocument } from '../features/work-queue/work-queue-types';

async function main() {
  const db = await getDatabase();
  const repository = new WorkQueueRepository(db.collection<WorkQueueCaseDocument>('workQueueCases'));

  await repository.ensureIndexes();
  const result = await repository.upsertSyntheticCases(syntheticCases);

  logger.info(
    {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    },
    'Synthetic work queue seed completed',
  );
}

main()
  .catch((error: unknown) => {
    logger.error({ error }, 'Synthetic seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongoConnection();
  });
