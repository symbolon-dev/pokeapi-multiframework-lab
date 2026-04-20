import type { Pokemon } from '@repo/types';

import { logger } from '@/lib/logger';
import { fetchAllPokemon } from './data';

export async function initializePokemonCache(): Promise<Pokemon[]> {
    logger.info('Initializing Pokemon cache...');

    const data = await fetchAllPokemon();
    const sortedData = [...data].sort((a, b) => a.id - b.id);

    logger.info(`Pokemon cache initialized with ${sortedData.length} Pokémon`);

    return sortedData;
}
