import { createServer } from 'http';

import { createApp } from './app';
import { loadEnv } from './config/env';
import { closeMongoConnection } from './database/mongo';
import { logger } from './logging/logger';

const env = loadEnv();
const app = createApp();
const server = createServer(app);

server.listen(env.port, env.host, () => {
  logger.info(
    {
      host: env.host,
      nodeEnv: env.nodeEnv,
      port: env.port,
    },
    'Server listening',
  );
});

server.on('error', (error) => {
  logger.error({ error }, 'Server failed');
  process.exit(1);
});

function shutdown(signal: NodeJS.Signals) {
  logger.info({ signal }, 'Shutdown signal received');

  const forceExitTimeout = setTimeout(() => {
    logger.error({ signal }, 'Graceful shutdown timed out');
    process.exit(1);
  }, 10_000);

  server.close((error) => {
    clearTimeout(forceExitTimeout);

    if (error) {
      logger.error({ error, signal }, 'Error during graceful shutdown');
      process.exit(1);
    }

    closeMongoConnection()
      .then(() => {
        logger.info({ signal }, 'Server closed');
        process.exit(0);
      })
      .catch((closeError: unknown) => {
        logger.error({ error: closeError, signal }, 'Error while closing MongoDB connection');
        process.exit(1);
      });
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
