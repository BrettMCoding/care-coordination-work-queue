import { Router } from 'express';

import { pingDatabase } from '../database/mongo';
import { HttpError } from '../errors/http-error';

export type ReadinessCheck = () => Promise<void>;

export function createReadinessRouter(readinessCheck: ReadinessCheck = pingDatabase) {
  const router = Router();

  router.get('/ready', async (_req, res, next) => {
    try {
      await readinessCheck();
      res.status(200).json({
        status: 'ready',
        service: 'care-coordination-work-queue-api',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(
        new HttpError(503, 'DATABASE_NOT_READY', 'Database connectivity check failed.', {
          reason: error instanceof Error ? error.message : 'Unknown database error',
        }),
      );
    }
  });

  return router;
}
