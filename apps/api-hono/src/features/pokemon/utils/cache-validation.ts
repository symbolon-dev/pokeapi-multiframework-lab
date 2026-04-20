import type { Pokemon } from '@repo/types';
import type { Context } from 'hono';

export function validatePokemonCache(
    c: Context,
    pokemonCache: Pokemon[] | undefined,
): { valid: true } | { valid: false; response: Response } {
    if (pokemonCache === undefined || pokemonCache.length === 0) {
        const logger = c.get('logger') as { error: (message: string) => void };
        logger.error('Pokemon cache is not initialized!');
        return {
            valid: false,
            response: c.json({ error: 'Service unavailable', status: 503 }, 503),
        };
    }
    return { valid: true };
}
