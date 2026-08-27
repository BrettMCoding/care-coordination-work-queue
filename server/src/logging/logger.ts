import pino from 'pino';

import { loadEnv } from '../config/env';

const env = loadEnv();

export const logger = pino({
  enabled: env.nodeEnv !== 'test' && process.env.VITEST !== 'true',
  level: env.logLevel,
  redact: [
    'req.headers.authorization',
    'req.headers.cookie',
    '*.authorization',
    '*.cookie',
    '*.credentials',
    '*.mongodbUri',
    '*.MONGODB_URI',
    '*.connectionString',
  ],
});
