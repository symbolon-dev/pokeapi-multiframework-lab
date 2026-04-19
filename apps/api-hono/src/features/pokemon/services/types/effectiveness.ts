import type { TypeDetails } from '@/features/pokemon/schemas/pokemon.types';
import { ALL_TYPES } from './cache';

export type TypeEffectiveness = {
    immune: { type: string; multiplier: 0 }[];
    resistant: { type: string; multiplier: 0.25 | 0.5 }[];
    normal: { type: string; multiplier: 1 }[];
    weak: { type: string; multiplier: 2 | 4 }[];
};

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
