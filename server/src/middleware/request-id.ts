import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

const requestIdHeader = 'x-request-id';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incomingRequestId = req.get(requestIdHeader)?.trim();
  const requestId = incomingRequestId || randomUUID();

  req.requestId = requestId;
  res.setHeader(requestIdHeader, requestId);

  next();
}
