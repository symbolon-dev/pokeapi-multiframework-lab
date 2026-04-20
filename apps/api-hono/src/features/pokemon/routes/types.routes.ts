import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { ErrorResponseSchema, TypeDataSchema, TypeParamSchema, TypesResponseSchema } from '@repo/types';
import { getTypeByName, getTypes } from '@/features/pokemon/controllers/types.controller';

export const typesRoutes = new OpenAPIHono();

const getTypesRoute = createRoute({
    method: 'get',
    path: '/types',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: TypesResponseSchema,
                },
            },
            description: 'Retrieve all available Pokemon types',
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

const getTypeByNameRoute = createRoute({
    method: 'get',
    path: '/types/{type}',
    request: {
        params: TypeParamSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: TypeDataSchema,
                },
            },
            description: 'Retrieve detailed information about a specific type including damage relations',
        },
        404: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Type not found',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Internal server error',
        },
    },
});

typesRoutes.openapi(getTypesRoute, getTypes);
typesRoutes.openapi(getTypeByNameRoute, getTypeByName);
