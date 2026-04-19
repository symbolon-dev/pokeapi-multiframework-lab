import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { getGenerations } from '@/features/pokemon/pokemon.controller';
import { GenerationsResponseSchema } from '@/features/pokemon/schemas/pokemon.internal';
import { ErrorResponseSchema } from '@/features/pokemon/schemas/pokemon.request';

export const generationsRoutes = new OpenAPIHono();

const getGenerationsRoute = createRoute({
    method: 'get',
    path: '/generations',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: GenerationsResponseSchema,
                },
            },
            description: 'Retrieve all available Pokemon generations',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Internal server error',
        },
        503: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Service unavailable - cache not loaded',
        },
    },
});

generationsRoutes.openapi(getGenerationsRoute, getGenerations);
