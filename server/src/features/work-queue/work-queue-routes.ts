import { Router } from 'express';

import { createWorkQueueService, WorkQueueService } from './work-queue-service';
import { caseIdParamsSchema, caseListQuerySchema } from './work-queue-schemas';

export function createWorkQueueRouter(serviceFactory = createWorkQueueService) {
  const router = Router();

  router.get('/api/cases', async (req, res, next) => {
    try {
      const query = caseListQuerySchema.parse(req.query);
      const service = await serviceFactory();
      const cases = await service.listCases(query);

      res.status(200).json({
        data: cases,
        meta: {
          count: cases.length,
          filters: {
            role: query.role ?? null,
            search: query.search ?? null,
            status: query.status ?? null,
            urgency: query.urgency ?? null,
          },
          sort: {
            by: query.sortBy,
            direction: query.sortDirection,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/api/cases/:id', async (req, res, next) => {
    try {
      const { id } = caseIdParamsSchema.parse(req.params);
      const service = await serviceFactory();
      const item = await service.getCaseById(id);

      res.status(200).json({ data: item });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export type WorkQueueServiceFactory = () => Promise<WorkQueueService>;
