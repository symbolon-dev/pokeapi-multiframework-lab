import type { PokemonData } from '@/types/pokemon';

import { fetchAllPokemon } from '@/utils/fetchers';
import { logger } from '@/utils/logger';

export async function initializePokemonCache(): Promise<PokemonData[]> {
    logger.info('Initializing Pokemon cache...');

    const data = await fetchAllPokemon();
    const sortedData = [...data].sort((a, b) => a.id - b.id);

    logger.info(`Pokemon cache initialized with ${sortedData.length} Pokémon`);

    return sortedData;
}
