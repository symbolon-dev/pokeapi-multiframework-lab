import type { PokemonData, PokemonDetails } from '@/features/pokemon/schemas/pokemon.types';

import { EvolutionSchema, GenerationsListSchema, PokemonDetailsSchema, PokemonSpeciesSchema } from '@/features/pokemon/schemas/pokemon.external';
import { fetchJson, POKEAPI_BASE_URL } from '@/features/pokemon/utils/fetcher';
import { logger } from '@/lib/logger';
import { loadGenerationPokemon } from '../generations/data';
import { mapPokemonData } from './mapper';

async function fetchPokemon(url: string): Promise<PokemonDetails | undefined> {
    try {
        const speciesData = await fetchJson(url);
        if (speciesData === undefined)
            return undefined;

        const species = PokemonSpeciesSchema.parse(speciesData);
        if (!species.varieties[0])
            return undefined;

        const dataDetails = await fetchJson(species.varieties[0].pokemon.url);
        const details = PokemonDetailsSchema.parse(dataDetails);

        const data = await fetchJson(species.evolution_chain.url);
        const evolutions = EvolutionSchema.parse(data);

        return { ...details, ...evolutions };
    }
    catch (error) {
        logger.warn({ error, url }, 'Error loading pokemon details');
        return undefined;
    }
}

export async function fetchPokemonBatch(speciesList: Array<{ name: string; url: string }>, generation: number): Promise<PokemonData[]> {
    const results = await Promise.all(
        speciesList.map(async (species) => {
            const pokemon = await fetchPokemon(species.url);
            return pokemon ? mapPokemonData(pokemon, generation) : undefined;
        }),
    );

    return results.filter((p: PokemonData | undefined): p is PokemonData => p !== undefined);
}

export async function fetchAllPokemon(): Promise<PokemonData[]> {
    logger.info('Fetching all Pokémon from PokeAPI...');

    const data = await fetchJson(`${POKEAPI_BASE_URL}/generation/`);
    const generations = GenerationsListSchema.parse(data);

    const allGenerations = await Promise.all(
        generations.results.map(async (_, i) =>
            loadGenerationPokemon(i + 1),
        ),
    );

    const allPokemon = allGenerations.flat();

    logger.info(`Total: ${allPokemon.length} Pokémon fetched`);

    return allPokemon;
}
