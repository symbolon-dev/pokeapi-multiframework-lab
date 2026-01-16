import type { Context } from 'hono';

import type { PokemonData, QueryParams } from '@/types/pokemon';
import { fetchTypeDetails } from '@/utils/fetchers';
import { queryPokemon } from '@/utils/filters';

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

// Using `any` as return type for all handlers - Hono's Context.json() returns complex
// Response objects with typed status codes; validation is handled by OpenAPI route definitions

// eslint-disable-next-line ts/no-explicit-any
export function getPokemon(c: Context): any {
    const pokemonCache = c.get('pokemonCache') as PokemonData[];

    if (pokemonCache === undefined || pokemonCache.length === 0) {
        const logger = c.get('logger') as { error: (message: string) => void };
        logger.error('Pokemon cache is not initialized!');
        return c.json({ error: 'Service unavailable', status: 503 }, 503);
    }

    const params: QueryParams = {
        search: (c.req.query('name') ?? c.req.query('id')) ?? undefined,
        types: c.req.queries('types'),
        generation: Number(c.req.query('generation')) || undefined,
        sort: c.req.query('sort') as 'id' | 'name' | undefined,
        order: c.req.query('order') as 'asc' | 'desc' | undefined,
    };

    const filtered = queryPokemon(params)(pokemonCache);

    const page = Math.max(1, Number(c.req.query('page')) || 1);
    const requestedLimit = Math.max(1, Number(c.req.query('limit')) || DEFAULT_LIMIT);
    const limit = Math.min(requestedLimit, MAX_LIMIT);
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return c.json({
        count: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
        pokemon: paginated,
    }, 200);
}

// eslint-disable-next-line ts/no-explicit-any
export function getPokemonById(c: Context): any {
    const pokemonCache = c.get('pokemonCache') as PokemonData[];

    if (pokemonCache === undefined || pokemonCache.length === 0) {
        const logger = c.get('logger') as { error: (message: string) => void };
        logger.error('Pokemon cache is not initialized!');
        return c.json({ error: 'Service unavailable', status: 503 }, 503);
    }

    const id = Number(c.req.param('id'));
    const result = pokemonCache.find((pokemon: PokemonData) => pokemon.id === id);

    if (!result) {
        return c.json({ error: 'Pokémon not found', status: 404 }, 404);
    }

    return c.json(result, 200);
}

// eslint-disable-next-line ts/no-explicit-any
export function getTypes(c: Context): any {
    const pokemonCache = c.get('pokemonCache') as PokemonData[];

    if (pokemonCache === undefined || pokemonCache.length === 0) {
        const logger = c.get('logger') as { error: (message: string) => void };
        logger.error('Pokemon cache is not initialized!');
        return c.json({ error: 'Service unavailable', status: 503 }, 503);
    }

    const types = [...new Set(
        pokemonCache.flatMap(p => p.types),
    )].sort();

    return c.json({ types }, 200);
}

// eslint-disable-next-line ts/no-explicit-any
export async function getTypeByName(c: Context): Promise<any> {
    const typeName = c.req.param('type').toLowerCase();

    const typeDetails = await fetchTypeDetails(typeName);

    if (!typeDetails) {
        return c.json({ error: 'Type not found', status: 404 }, 404);
    }

    c.header('Cache-Control', 'public, max-age=604800'); // 1 week
    return c.json(typeDetails, 200);
}

// eslint-disable-next-line ts/no-explicit-any
export function getGenerations(c: Context): any {
    const pokemonCache = c.get('pokemonCache') as PokemonData[];

    if (pokemonCache === undefined || pokemonCache.length === 0) {
        const logger = c.get('logger') as { error: (message: string) => void };
        logger.error('Pokemon cache is not initialized!');
        return c.json({ error: 'Service unavailable', status: 503 }, 503);
    }

    const generations = [...new Set(
        pokemonCache.map(p => p.generation),
    )].sort((a, b) => a - b);

    return c.json({ generations }, 200);
}
