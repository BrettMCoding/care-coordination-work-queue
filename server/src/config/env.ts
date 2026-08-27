import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

export type AppEnv = {
  corsAllowedOrigins: string[];
  databaseName: string;
  host: string;
  logLevel: string;
  mongodbUri?: string;
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
};

const envSchema = z.object({
  CORS_ALLOWED_ORIGINS: z.string().optional(),
  HOST: z.string().trim().min(1).default('0.0.0.0'),
  LOG_LEVEL: z.string().trim().min(1).default('info'),
  MONGODB_DB_NAME: z.string().trim().min(1).default('carequeue'),
  MONGODB_URI: z.string().trim().min(1).optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(8080),
});

const defaultCorsAllowedOrigins = [
  'http://localhost:8081',
  'http://localhost:19006',
  'http://127.0.0.1:8081',
  'https://carequeue.brettmarshmakesthings.com',
];

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const parsed = envSchema.parse(source);

  return {
    corsAllowedOrigins: parseCorsAllowedOrigins(parsed.CORS_ALLOWED_ORIGINS),
    databaseName: parsed.MONGODB_DB_NAME,
    host: parsed.HOST,
    logLevel: parsed.LOG_LEVEL,
    mongodbUri: parsed.MONGODB_URI,
    nodeEnv: parsed.NODE_ENV,
    port: parsed.PORT,
  };
}

function parseCorsAllowedOrigins(value: string | undefined): string[] {
  if (!value) {
    return defaultCorsAllowedOrigins;
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
