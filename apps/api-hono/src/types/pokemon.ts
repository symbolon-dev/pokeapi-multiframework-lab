import type { z } from 'zod';

import type { EvolutionChainSchema, GenerationSchema, PokemonDetailsSchema, PokemonSpeciesSchema, TypeDetailsApiSchema } from '@/schemas/api';
import type { DamageRelationsSchema, PokemonDataSchema, TypeDetailsSchema } from '@/schemas/pokemon';
import type { QueryParamsSchema } from '@/schemas/query';

export type PokemonData = z.infer<typeof PokemonDataSchema>;
export type GenerationData = z.infer<typeof GenerationSchema>;
export type PokemonDetails = z.infer<typeof PokemonDetailsSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;
export type QueryParams = z.infer<typeof QueryParamsSchema>;
export type TypeDetails = z.infer<typeof TypeDetailsSchema>;
export type TypeDetailsApi = z.infer<typeof TypeDetailsApiSchema>;
export type DamageRelations = z.infer<typeof DamageRelationsSchema>;

export type MappedEvolution = {
    name: string;
    id: number;
    sprite: string;
    minLevel?: number;
    children: MappedEvolution[];
};
