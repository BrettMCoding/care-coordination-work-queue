import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/healthz', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'care-coordination-work-queue-api',
    timestamp: new Date().toISOString(),
  });
});
