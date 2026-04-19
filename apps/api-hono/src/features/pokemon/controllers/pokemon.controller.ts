import type { Context } from 'hono';

import type { PokemonData, QueryParams } from '@/features/pokemon/schemas/pokemon.types';
import { queryPokemon } from '@/features/pokemon/services/pokemon/query';
import { calculateTypeEffectiveness } from '@/features/pokemon/services/types/effectiveness';
import { validatePokemonCache } from '@/features/pokemon/utils/cache-validation';

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

// Using `any` as return type for all handlers - Hono's Context.json() returns complex
// Response objects with typed status codes; validation is handled by OpenAPI route definitions

// eslint-disable-next-line ts/no-explicit-any
export function getPokemon(c: Context): any {
    const pokemonCache = c.get('pokemonCache') as PokemonData[];

    const validation = validatePokemonCache(c, pokemonCache);
    if (!validation.valid)
        return validation.response;

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
    const typeCache = c.get('typeCache') as Record<string, any>;

    const validation = validatePokemonCache(c, pokemonCache);
    if (!validation.valid)
        return validation.response;

    const id = Number(c.req.param('id'));
    const result = pokemonCache.find((pokemon: PokemonData) => pokemon.id === id);

    if (!result) {
        return c.json({ error: 'Pokémon not found', status: 404 }, 404);
    }

    const typeEffectiveness = calculateTypeEffectiveness(result.types, typeCache);

    return c.json({ ...result, typeEffectiveness }, 200);
}
