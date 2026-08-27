import cors from 'cors';

import type { AppEnv } from '../config/env';
import { HttpError } from '../errors/http-error';

export function createCorsMiddleware(env: AppEnv) {
  const allowedOrigins = new Set(env.corsAllowedOrigins);

  return cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new HttpError(403, 'CORS_ORIGIN_DENIED', 'Origin is not allowed.'));
    },
  });
}
