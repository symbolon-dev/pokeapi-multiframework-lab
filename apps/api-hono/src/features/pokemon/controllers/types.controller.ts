import type { Pokemon, TypeData } from '@repo/types';

import type { Context } from 'hono';
import { fetchTypeDetails } from '@/features/pokemon/services/types/data';
import { validatePokemonCache } from '@/features/pokemon/utils/cache-validation';

// Using `any` as return type for all handlers - Hono's Context.json() returns complex
// Response objects with typed status codes; validation is handled by OpenAPI route definitions

// eslint-disable-next-line ts/no-explicit-any
export function getTypes(c: Context): any {
    const pokemonCache = c.get('pokemonCache') as Pokemon[];

    const validation = validatePokemonCache(c, pokemonCache);
    if (!validation.valid)
        return validation.response;

    const types = [...new Set(
        pokemonCache.flatMap(p => p.types),
    )].sort();

    return c.json(types, 200);
}

// eslint-disable-next-line ts/no-explicit-any
export async function getTypeByName(c: Context): Promise<any> {
    const typeName = c.req.param('type')?.toLowerCase();

    if (typeName == null) {
        return c.json({ error: 'Type parameter is required', status: 400 }, 400);
    }

    const typeDetails = await fetchTypeDetails(typeName) as TypeData;

    if (typeDetails === undefined) {
        return c.json({ error: 'Type not found', status: 404 }, 404);
    }

    c.header('Cache-Control', 'public, max-age=604800'); // 1 week
    return c.json(typeDetails, 200);
}
