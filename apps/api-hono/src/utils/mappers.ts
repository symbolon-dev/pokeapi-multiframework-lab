import type { EvolutionChain, MappedEvolution, PokemonData, PokemonDetails, TypeDetails, TypeDetailsApi } from '@/types/pokemon';

import { ALL_TYPES } from '@/services/types';
import { extractDominantColor } from '@/utils/color';

export type TypeEffectiveness = {
    immune: { type: string; multiplier: 0 }[];
    resistant: { type: string; multiplier: 0.25 | 0.5 }[];
    normal: { type: string; multiplier: 1 }[];
    weak: { type: string; multiplier: 2 | 4 }[];
};

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
        stats: Object.fromEntries(
            parsed.stats.map(s => [s.stat.name, s.base_stat]),
        ),
        sprites: {
            sprite: parsed.sprites.front_default,
            default: artworkUrl,
            defaultShiny: parsed.sprites.other['official-artwork'].front_shiny,
            dominantColor,
        },
        evolutions: parsed.chain
            ? mapEvolutionChain(parsed.chain)
            : [],

    };
}

const ARTWORK_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

function extractIdFromUrl(url: string): number {
    return Number(url.replace(/\/$/, '').split('/').pop());
}

function mapEvolutionChain(chain: EvolutionChain, minLevel?: number | undefined): MappedEvolution[] {
    const id = extractIdFromUrl(chain.species.url);
    const current: MappedEvolution = {
        name: chain.species.name,
        id,
        sprite: `${ARTWORK_BASE_URL}/${id}.png`,
        minLevel: minLevel ?? undefined,
    };

    if (!chain.evolves_to?.length) {
        return [current];
    }

    const evolutions = chain.evolves_to.flatMap((evo: EvolutionChain) =>
        mapEvolutionChain(evo, evo.evolution_details?.[0]?.min_level ?? undefined),
    );

    return [current, ...evolutions];
}

export function mapTypeDetails(apiData: TypeDetailsApi): TypeDetails {
    return {
        id: apiData.id,
        name: apiData.name,
        damageRelations: {
            doubleDamageTo: apiData.damage_relations.double_damage_to.map(t => t.name),
            doubleDamageFrom: apiData.damage_relations.double_damage_from.map(t => t.name),
            halfDamageTo: apiData.damage_relations.half_damage_to.map(t => t.name),
            halfDamageFrom: apiData.damage_relations.half_damage_from.map(t => t.name),
            noDamageTo: apiData.damage_relations.no_damage_to.map(t => t.name),
            noDamageFrom: apiData.damage_relations.no_damage_from.map(t => t.name),
        },
    };
}

export function calculateTypeEffectiveness(
    pokemonTypes: string[],
    typeCache: Record<string, TypeDetails>,
): TypeEffectiveness {
    const multipliers = pokemonTypes
        .map(type => typeCache[type]?.damageRelations)
        .filter((rel): rel is NonNullable<typeof rel> => rel !== undefined)
        .flatMap(relations => [
            ...relations.doubleDamageFrom.map(t => [t, 2] as const),
            ...relations.halfDamageFrom.map(t => [t, 0.5] as const),
            ...relations.noDamageFrom.map(t => [t, 0] as const),
        ])
        .reduce<Record<string, number>>(
            (acc, [type, multiplier]) => ({
                ...acc,
                [type]: (acc[type] ?? 1) * multiplier,
            }),
            {},
        );

    const allEntries = ALL_TYPES.map(type => [type, multipliers[type] ?? 1] as const);

    return {
        immune: allEntries
            .filter(([, m]) => m === 0)
            .map(([t]) => ({ type: t, multiplier: 0 })),
        resistant: allEntries
            .filter(([, m]) => m === 0.25 || m === 0.5)
            .map(([t, m]) => ({ type: t, multiplier: m as 0.25 | 0.5 })),
        normal: allEntries
            .filter(([, m]) => m === 1)
            .map(([t]) => ({ type: t, multiplier: 1 })),
        weak: allEntries
            .filter(([, m]) => m === 2 || m === 4)
            .map(([t, m]) => ({ type: t, multiplier: m as 2 | 4 })),
    };
}
