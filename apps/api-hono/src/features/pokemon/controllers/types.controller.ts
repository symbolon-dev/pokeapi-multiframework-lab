import type { Context } from 'hono';

import type { PokemonData } from '@/features/pokemon/schemas/pokemon.types';
import { fetchTypeDetails } from '@/features/pokemon/services/types/data';
import { validatePokemonCache } from '@/features/pokemon/utils/cache-validation';

// Using `any` as return type for all handlers - Hono's Context.json() returns complex
// Response objects with typed status codes; validation is handled by OpenAPI route definitions

// eslint-disable-next-line ts/no-explicit-any
export function getTypes(c: Context): any {
    const pokemonCache = c.get('pokemonCache') as PokemonData[];

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

    const typeDetails = await fetchTypeDetails(typeName as string);

    if (!typeDetails) {
        return c.json({ error: 'Type not found', status: 404 }, 404);
    }

    c.header('Cache-Control', 'public, max-age=604800'); // 1 week
    return c.json(typeDetails, 200);
}
