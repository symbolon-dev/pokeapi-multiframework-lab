import type { z } from 'zod';
import {
	DamageRelationsSchema,
	EvolutionRequirementSchema,
	GenerationsResponseSchema,
	PokemonDetailSchema,
	PokemonPageSchema,
	PokemonSchema,
	QueryParamsSchema,
	TypeDataSchema,
	TypeEffectivenessEntrySchema,
	TypeEffectivenessSchema,
	TypesResponseSchema,
} from './schemas/pokemon.schema';
import {
	GenerationSchema,
	PokemonDetailsSchema,
	PokemonSpeciesSchema,
	EvolutionChainSchema,
	TypeDetailsApiSchema,
} from './schemas/pokemon.external';

export type EvolutionRequirement = z.infer<typeof EvolutionRequirementSchema>;
export type EvolutionNode = {
	name: string;
	id: number;
	sprite: string;
	requirement?: EvolutionRequirement;
	children: EvolutionNode[];
}
export type Pokemon = z.infer<typeof PokemonSchema>;
export type DamageRelations = z.infer<typeof DamageRelationsSchema>;
export type TypeData = z.infer<typeof TypeDataSchema>;
export type TypeEffectivenessEntry = z.infer<typeof TypeEffectivenessEntrySchema>;
export type TypeEffectiveness = z.infer<typeof TypeEffectivenessSchema>;
export type PokemonPage = z.infer<typeof PokemonPageSchema>;
export type PokemonDetail = z.infer<typeof PokemonDetailSchema>;
export type QueryParams = z.infer<typeof QueryParamsSchema>;
export type TypesResponse = z.infer<typeof TypesResponseSchema>;
export type GenerationsResponse = z.infer<typeof GenerationsResponseSchema>;

export type SortOrder = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc';

export type Filters = {
	name: string;
	types: string[];
	generation: string | number;
	sort: string;
	order: string;
};

// Core API response schemas
export {
	DamageRelationsSchema,
	EvolutionRequirementSchema,
	GenerationsResponseSchema,
	PokemonDetailSchema,
	PokemonPageSchema,
	PokemonSchema,
	QueryParamsSchema,
	TypeDataSchema,
	TypeEffectivenessEntrySchema,
	TypeEffectivenessSchema,
	TypesResponseSchema,
};

// External API schemas (PokeAPI)
export {
	GenerationsListSchema,
	GenerationSchema,
	EvolutionChainSchema,
	EvolutionSchema,
	PokemonSpeciesSchema,
	PokemonDetailsSchema,
	TypeDetailsApiSchema,
} from './schemas/pokemon.external';

// Request validation schemas
export {
	PokemonListQuerySchema,
	PokemonIdParamSchema,
	TypeParamSchema,
	ErrorResponseSchema,
} from './schemas/pokemon.request';

// Type inferences from external schemas
export type GenerationData = z.infer<typeof GenerationSchema>;
export type PokemonDetails = z.infer<typeof PokemonDetailsSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;
export type TypeDetailsApi = z.infer<typeof TypeDetailsApiSchema>;
