import type { TypeDetails } from '@/types/pokemon';

import { fetchTypeDetails } from '@/utils/fetchers';
import { logger } from '@/utils/logger';

export const ALL_TYPES = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
];

export async function initializeTypeCache(): Promise<Record<string, TypeDetails>> {
    logger.info('Initializing type cache...');

    const results = await Promise.all(
        ALL_TYPES.map(async (type) => {
            const details = await fetchTypeDetails(type);
            return { type, details };
        }),
    );

    const typeCache = Object.fromEntries(
        results
            .filter((r): r is { type: string; details: TypeDetails } => r.details !== undefined)
            .map(r => [r.type, r.details]),
    );

    logger.info(`Type cache initialized with ${Object.keys(typeCache).length} types`);

    return typeCache;
}
