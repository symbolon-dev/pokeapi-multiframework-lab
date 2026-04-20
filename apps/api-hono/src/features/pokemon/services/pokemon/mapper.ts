import type { Pokemon, PokemonDetails } from '@repo/types';

import { extractDominantColor } from '@/lib/color';
import { mapEvolutionChain } from './evolution';

export async function mapPokemonData(parsed: PokemonDetails, generation: number): Promise<Pokemon> {
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
