import process from 'node:process';

import { createApp } from '@/app';
import { env } from '@/config/env';
import { initializePokemonCache } from '@/services/pokemon';
import { logger } from '@/utils/logger';

async function startServer(): Promise<void> {
    const port = env.PORT;
    const pokemonCache = await initializePokemonCache();

    const app = createApp(pokemonCache);

    const server = Bun.serve({
        fetch: app.fetch,
        port,
    });

    logger.info(`API ready at http://localhost:${port}`);
    logger.info(`${pokemonCache.length} Pokémon in cache`);

    const shutdown = async (signal: string): Promise<void> => {
        logger.info(`${signal} received, shutting down gracefully...`);

        void server.stop();

        logger.info('Server closed, exiting process');
        void process.exit(0);
    };

    process.on('SIGINT', () => {
        void shutdown('SIGINT');
    });
    process.on('SIGTERM', () => {
        void shutdown('SIGTERM');
    });
}

void startServer().catch(err => logger.error({ err }, 'Error on start'));
