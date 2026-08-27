import { Db, MongoClient } from 'mongodb';

import { loadEnv } from '../config/env';
import { HttpError } from '../errors/http-error';
import { logger } from '../logging/logger';

let clientPromise: Promise<MongoClient> | undefined;

export function getMongoClient() {
  if (!clientPromise) {
    const env = loadEnv();

    if (!env.mongodbUri) {
      throw new HttpError(
        503,
        'DATABASE_NOT_CONFIGURED',
        'Database connection is not configured.',
      );
    }

    const client = new MongoClient(env.mongodbUri, {
      appName: 'care-coordination-work-queue',
    });

    clientPromise = client.connect().catch((error: unknown) => {
      clientPromise = undefined;
      throw error;
    });
  }

  return clientPromise;
}

export async function getDatabase(): Promise<Db> {
  const env = loadEnv();
  const client = await getMongoClient();

  return client.db(env.databaseName);
}

export async function pingDatabase() {
  const db = await getDatabase();
  await db.command({ ping: 1 });
}

export async function closeMongoConnection() {
  if (!clientPromise) {
    return;
  }

  const client = await clientPromise;
  await client.close();
  clientPromise = undefined;
  logger.info('MongoDB connection closed');
}
