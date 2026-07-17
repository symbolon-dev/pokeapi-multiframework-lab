import process from 'node:process';

import { serve } from '@hono/node-server';

import { createApp } from '@/app';
import { env } from '@/config/env';
import { initializePokemonCache } from '@/features/pokemon/services/pokemon/cache';
import { initializeTypeCache } from '@/features/pokemon/services/types/cache';
import { logger } from '@/lib/logger';

async function startServer(): Promise<void> {
    const port = Number.parseInt(env.PORT, 10);
    const pokemonCache = await initializePokemonCache();
    const typeCache = await initializeTypeCache();

    const app = createApp(pokemonCache, typeCache);

    const server = serve({
        fetch: app.fetch,
        port,
    });

    logger.info(`API ready at http://localhost:${port}`);
    logger.info(`${pokemonCache.length} Pokémon in cache`);
    logger.info(`${Object.keys(typeCache).length} Types in cache`);

    const shutdown = async (signal: string): Promise<void> => {
        logger.info(`${signal} received, shutting down gracefully...`);

        server.close();

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
