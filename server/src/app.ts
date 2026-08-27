import express from 'express';
import pinoHttp from 'pino-http';

import { loadEnv } from './config/env';
import { createWorkQueueRouter, type WorkQueueServiceFactory } from './features/work-queue/work-queue-routes';
import { errorHandlerMiddleware } from './middleware/error-handler';
import { createCorsMiddleware } from './middleware/cors';
import { notFoundMiddleware } from './middleware/not-found';
import { requestIdMiddleware } from './middleware/request-id';
import { healthRouter } from './routes/health';
import { createReadinessRouter, type ReadinessCheck } from './routes/readiness';
import { logger } from './logging/logger';

export type CreateAppOptions = {
  readinessCheck?: ReadinessCheck;
  workQueueServiceFactory?: WorkQueueServiceFactory;
};

export function createApp(options: CreateAppOptions = {}) {
  const env = loadEnv();
  const app = express();

  app.disable('x-powered-by');
  app.use(requestIdMiddleware);
  app.use(
    pinoHttp({
      logger,
      customProps: (req) => ({
        requestId: req.requestId,
      }),
    }),
  );
  app.use(createCorsMiddleware(env));
  app.use(express.json());

  app.use(healthRouter);
  app.use(createReadinessRouter(options.readinessCheck));
  app.use(createWorkQueueRouter(options.workQueueServiceFactory));

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
