import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { ErrorResponseSchema, PokemonIdParamSchema, PokemonListQuerySchema, PokemonPageSchema, PokemonSchema } from '@repo/types';
import { getPokemon, getPokemonById } from '@/features/pokemon/controllers/pokemon.controller';

export const pokemonRoutes = new OpenAPIHono();

const getPokemonRoute = createRoute({
    method: 'get',
    path: '/',
    request: {
        query: PokemonListQuerySchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: PokemonPageSchema,
                },
            },
            description: 'Retrieve paginated and filtered list of Pokemon',
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Invalid query parameters',
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

const getPokemonByIdRoute = createRoute({
    method: 'get',
    path: '/{id}',
    request: {
        params: PokemonIdParamSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: PokemonSchema,
                },
            },
            description: 'Retrieve a Pokemon by ID',
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Invalid Pokemon ID',
        },
        404: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Pokemon not found',
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

pokemonRoutes.openapi(getPokemonRoute, getPokemon);
pokemonRoutes.openapi(getPokemonByIdRoute, getPokemonById);
