import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { loadEnv } from '../config/env';
import { HttpError } from '../errors/http-error';
import { logger } from '../logging/logger';

type ErrorResponseBody = {
  error: {
    code: string;
    details?: unknown;
    message: string;
    requestId: string;
  };
};

export const errorHandlerMiddleware: ErrorRequestHandler = (error, req, res, _next) => {
  const requestId = req.requestId;
  const httpError = normalizeError(error);
  const shouldExposeDetails = shouldIncludeDetails(httpError);

  if (httpError.statusCode >= 500) {
    logger.error({ error, requestId }, 'Unhandled request error');
  }

  const responseBody: ErrorResponseBody = {
    error: {
      code: httpError.code,
      ...(httpError.details === undefined || !shouldExposeDetails
        ? {}
        : { details: httpError.details }),
      message: httpError.message,
      requestId,
    },
  };

  res.status(httpError.statusCode).json(responseBody);
};

function shouldIncludeDetails(error: HttpError) {
  const env = loadEnv();

  return env.nodeEnv !== 'production' || error.statusCode < 500;
}

function normalizeError(error: unknown): HttpError {
  if (error instanceof HttpError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new HttpError(400, 'VALIDATION_ERROR', 'Request validation failed.', error.issues);
  }

  return new HttpError(500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred.');
}
