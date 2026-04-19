import type { PokemonData, PokemonDetails } from '@/features/pokemon/schemas/pokemon.types';

import { extractDominantColor } from '@/lib/color';
import { mapEvolutionChain } from './evolution';

export async function mapPokemonData(parsed: PokemonDetails, generation: number): Promise<PokemonData> {
    const artworkUrl = parsed.sprites.other['official-artwork'].front_default;
    const dominantColor = (artworkUrl != null) ? await extractDominantColor(artworkUrl) : undefined;

    return {
        id: parsed.id,
        name: parsed.name,
        height: parsed.height,
        weight: parsed.weight,
        generation,
        is_default: parsed.is_default,
        types: parsed.types.map(t => t.type.name),
        sprites: {
            default: artworkUrl,
            defaultShiny: parsed.sprites.other['official-artwork'].front_shiny,
            dominantColor: dominantColor ?? null,
        },
        evolutions: parsed.chain
            ? mapEvolutionChain(parsed.chain)
            : null,

    };
}
