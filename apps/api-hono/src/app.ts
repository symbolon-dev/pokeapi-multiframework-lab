import type { Pokemon, TypeData } from '@repo/types';
import type { PinoLogger } from 'hono-pino';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { pinoLogger } from 'hono-pino';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import { secureHeaders } from 'hono/secure-headers';

import pino from 'pino';
import { env } from '@/config/env';
import { generationsRoutes } from '@/features/pokemon/routes/generations.routes';
import { pokemonRoutes } from '@/features/pokemon/routes/pokemon.routes';
import { typesRoutes } from '@/features/pokemon/routes/types.routes';
import { rateLimiter } from '@/middleware/rate-limiter';

type AppVariables = {
    Variables: {
        pokemonCache: Pokemon[];
        typeCache: Record<string, TypeData>;
        logger: PinoLogger;
    };
};

export function createApp(pokemonCache: Pokemon[], typeCache: Record<string, TypeData>): OpenAPIHono<AppVariables> {
    const app = new OpenAPIHono<AppVariables>();

    // Global middleware
    app.use('*', pinoLogger({
        pino: env.NODE_ENV === 'development'
            ? pino({
                    level: 'debug',
                    transport: {
                        target: 'pino-pretty',
                        options: { colorize: true },
                    },
                })
            : pino({ level: 'info' }),
    }));
    app.use('*', rateLimiter({ windowMs: 15 * 60 * 1000, max: 500 })); // 500 requests per 15 minutes
    app.use('*', secureHeaders());
    app.use('*', cors({
        origin: env.CORS_ORIGINS,
        credentials: true,
        maxAge: 86400, // 24 hours
    }));

    // Set pokemon cache in context
    app.use('*', async (c, next) => {
        c.set('pokemonCache', pokemonCache);
        c.set('typeCache', typeCache);
        await next();
    });

    // ETag middleware for 304 responses
    app.use('*', etag());

    // Cache-Control headers (browser/CDN caching)
    app.use('/api/pokemon/*', async (c, next) => {
        await next();
        c.header('Cache-Control', 'public, max-age=604800'); // 1 week
    });

    // Health check
    app.get('/health', c => c.json({ status: 'ok', timestamp: Date.now() }));

    // Routes - more specific routes first to avoid catch-all /{id} matching
    app.route('/api/pokemon', typesRoutes);
    app.route('/api/pokemon', generationsRoutes);
    app.route('/api/pokemon', pokemonRoutes);

    // OpenAPI documentation
    app.doc('/doc', {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Pokemon API',
            description: 'API for browsing and filtering Pokemon data',
        },
    });

    // Swagger UI
    app.get('/ui', swaggerUI({ url: '/doc' }));

    // Dummy route for favicon
    app.get('/favicon.ico', c => c.body(null, 204));

    // Error handling
    app.onError((err, c) => {
        c.get('logger').error({ err }, 'Request error');
        return c.json({
            error: env.NODE_ENV === 'production'
                ? 'Internal Server Error'
                : err.message,
            status: 500,
        }, 500);
    });

    app.notFound((c) => {
        return c.json({
            error: 'Route not found',
            status: 404,
        }, 404);
    });

    return app;
}

export type AppType = ReturnType<typeof createApp>;
