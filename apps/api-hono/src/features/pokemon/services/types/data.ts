import type { TypeDetails } from '@/features/pokemon/schemas/pokemon.types';

import { TypeDetailsApiSchema } from '@/features/pokemon/schemas/pokemon.external';
import { fetchJson, POKEAPI_BASE_URL } from '@/features/pokemon/utils/fetcher';
import { cacheGet, cacheSet } from '@/lib/cache';
import { logger } from '@/lib/logger';
import { mapTypeDetails } from './mapper';

export async function fetchTypeDetails(typeName: string): Promise<TypeDetails | undefined> {
    const cacheKey = `type:${typeName}`;
    const cached = cacheGet<TypeDetails>(cacheKey);
    if (cached)
        return cached;

    try {
        const data = await fetchJson(`${POKEAPI_BASE_URL}/type/${typeName}`);
        if (data === undefined)
            return undefined;

        const parsed = TypeDetailsApiSchema.parse(data);
        const typeDetails = mapTypeDetails(parsed);

        cacheSet(cacheKey, typeDetails);
        return typeDetails;
    }
    catch (error) {
        logger.warn({ error, typeName }, 'Error loading type details');
        return undefined;
    }
}
