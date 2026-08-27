import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '../errors/http-error';

export function notFoundMiddleware(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, 'NOT_FOUND', `No route found for ${req.method} ${req.path}`));
}
