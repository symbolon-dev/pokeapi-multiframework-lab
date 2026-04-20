import type { GenerationData, Pokemon } from '@repo/types';

import { GenerationSchema } from '@repo/types';
import { chunk } from 'lodash-es';
import { BATCH_SIZE, fetchJson, POKEAPI_BASE_URL } from '@/features/pokemon/utils/fetcher';
import { logger } from '@/lib/logger';
import { fetchPokemonBatch } from '../pokemon/data';

export async function fetchGenerationData(genId: number): Promise<GenerationData | undefined> {
    try {
        const data = await fetchJson(`${POKEAPI_BASE_URL}/generation/${genId}`);
        return GenerationSchema.parse(data);
    }
    catch (error) {
        logger.warn({ error, genId }, 'Error loading generation');
        return undefined;
    }
}

export async function loadGenerationPokemon(genId: number): Promise<Pokemon[]> {
    const genData = await fetchGenerationData(genId);

    if (!genData?.pokemon_species) {
        logger.warn({ genId }, 'No Pokemon species data for generation');
        return [];
    }

    const batches = chunk(genData.pokemon_species, BATCH_SIZE);

    const allPokemon = await Promise.all(
        batches.map(async (batch, index) => {
            const pokemon = await fetchPokemonBatch(batch, genId);
            logger.debug(`Gen ${genId} - Batch ${index + 1}/${batches.length} (${pokemon.length} Pokémon)`);
            return pokemon;
        }),
    );

    return allPokemon.flat();
}
