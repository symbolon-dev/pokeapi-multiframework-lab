import type { MappedEvolution } from '@/types/pokemon';
import { z } from '@hono/zod-openapi';

export const MappedEvolutionSchema: z.ZodType<MappedEvolution> = z.object({
    name: z.string().openapi({ example: 'bulbasaur' }),
    id: z.number().openapi({ example: 1 }),
    sprite: z.string().openapi({ example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' }),
    minLevel: z.number().optional(),
    children: z.lazy(() => MappedEvolutionSchema.array()),
}).openapi({ description: 'Evolution chain node' }) as z.ZodType<MappedEvolution>;

export const PokemonDataSchema = z.object({
    id: z.number().openapi({ example: 25 }),
    name: z.string().openapi({ example: 'pikachu' }),
    height: z.number().openapi({ example: 4, description: 'Height in decimeters' }),
    weight: z.number().openapi({ example: 60, description: 'Weight in hectograms' }),
    generation: z.number().openapi({ example: 1 }),
    is_default: z.boolean().openapi({ example: true }),
    types: z.array(z.string()).openapi({ example: ['electric'] }),
    sprites: z.object({
        default: z.string().nullable().openapi({
            example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        }),
        defaultShiny: z.string().nullable().openapi({
            example: 'https://raw.githubusercontent.com/PokeAPI/sprites.master/sprites/pokemon/other/official-artwork/shiny/25.png',
        }),
        dominantColor: z.string().nullable().openapi({
            example: 'oklch(0.78 0.16 95)',
            description: 'Dominant color extracted from sprite, in CSS oklch() notation',
        }),
    }).openapi({ description: 'Pokemon sprite URLs and dominant color' }),
    evolutions: MappedEvolutionSchema.nullable().openapi({ description: 'Evolution chain as a tree' }),
}).openapi('PokemonData');

export const PokemonListResponseSchema = z.object({
    count: z.number().openapi({ example: 150, description: 'Total number of Pokemon matching filters' }),
    page: z.number().openapi({ example: 1, description: 'Current page number' }),
    limit: z.number().openapi({ example: 20, description: 'Items per page' }),
    totalPages: z.number().openapi({ example: 8, description: 'Total number of pages' }),
    pokemon: z.array(PokemonDataSchema).openapi({ description: 'List of Pokemon on this page' }),
}).openapi('PokemonListResponse');

export const TypesResponseSchema = z.object({
    types: z.array(z.string()).openapi({ example: ['electric', 'fire', 'water'], description: 'List of all Pokemon types' }),
}).openapi('TypesResponse');

export const GenerationsResponseSchema = z.object({
    generations: z.array(z.number()).openapi({ example: [1, 2, 3, 4, 5], description: 'List of all Pokemon generations' }),
}).openapi('GenerationsResponse');

export const DamageRelationsSchema = z.object({
    doubleDamageTo: z.array(z.string()).openapi({
        example: ['grass', 'ice', 'bug', 'steel'],
        description: 'Types that take double damage from this type',
    }),
    doubleDamageFrom: z.array(z.string()).openapi({
        example: ['water', 'ground', 'rock'],
        description: 'Types that deal double damage to this type',
    }),
    halfDamageTo: z.array(z.string()).openapi({
        example: ['fire', 'water', 'rock', 'dragon'],
        description: 'Types that take half damage from this type',
    }),
    halfDamageFrom: z.array(z.string()).openapi({
        example: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
        description: 'Types that deal half damage to this type',
    }),
    noDamageTo: z.array(z.string()).openapi({
        example: [],
        description: 'Types that take no damage from this type',
    }),
    noDamageFrom: z.array(z.string()).openapi({
        example: [],
        description: 'Types that deal no damage to this type',
    }),
}).openapi('DamageRelations');

export const TypeDetailsSchema = z.object({
    id: z.number().openapi({ example: 10, description: 'Type ID' }),
    name: z.string().openapi({ example: 'fire', description: 'Type name' }),
    damageRelations: DamageRelationsSchema,
}).openapi('TypeDetails');

export const TypeEffectivenessEntrySchema = z.object({
    type: z.string().openapi({ example: 'water' }),
    multiplier: z.union([z.literal(0), z.literal(0.25), z.literal(0.5), z.literal(1), z.literal(2), z.literal(4)]),
});

export const TypeEffectivenessSchema = z.object({
    immune: z.array(TypeEffectivenessEntrySchema),
    resistant: z.array(TypeEffectivenessEntrySchema),
    normal: z.array(TypeEffectivenessEntrySchema),
    weak: z.array(TypeEffectivenessEntrySchema),
}).openapi('TypeEffectiveness');

export const PokemonDetailResponseSchema = PokemonDataSchema.extend({
    typeEffectiveness: TypeEffectivenessSchema,
}).openapi('PokemonDetailResponse');
