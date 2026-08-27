import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'care-coordination-work-queue-api',
    timestamp: new Date().toISOString(),
  });
});
