import type { Pokemon } from '@repo/types';

import type { Context } from 'hono';
import { validatePokemonCache } from '@/features/pokemon/utils/cache-validation';

// Using `any` as return type for all handlers - Hono's Context.json() returns complex
// Response objects with typed status codes; validation is handled by OpenAPI route definitions

// eslint-disable-next-line ts/no-explicit-any
export function getGenerations(c: Context): any {
    const pokemonCache = c.get('pokemonCache') as Pokemon[];

    const validation = validatePokemonCache(c, pokemonCache);
    if (!validation.valid)
        return validation.response;

    const generations = [...new Set(
        pokemonCache.map(p => p.generation),
    )].sort((a, b) => a - b);

    return c.json(generations, 200);
}
