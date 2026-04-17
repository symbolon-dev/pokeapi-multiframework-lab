export type SortOrder = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc';

export type Filters = {
    name: string;
    types: string[];
    generation: string | number;
    sort: string;
    order: string;
};

export type PokemonPage = {
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    pokemon: Pokemon[];
};

export type EvolutionRequirement = {
    trigger: string;
    item?: {
        name: string;
        url: string;
    };
    minLevel?: number;
    location?: {
        name: string;
        url: string;
    };
    minHappiness?: number;
    minAffection?: number;
    timeOfDay?: string;
    knownMoveType?: {
        name: string;
        url: string;
    };
    minBeauty?: number;
    relativePhysicalStats?: number;
    needsOverworldRain?: boolean;
    turnUpsideDown?: boolean;
    gender?: number;
    heldItem?: {
        name: string;
        url: string;
    };
    knownMove?: {
        name: string;
        url: string;
    };
    partySpecies?: {
        name: string;
        url: string;
    };
    partyType?: {
        name: string;
        url: string;
    };
    tradeSpecies?: {
        name: string;
        url: string;
    };
};

export type EvolutionNode = {
    name: string;
    id: number;
    sprite: string;
    requirement?: EvolutionRequirement;
    children: EvolutionNode[];
};

export type Pokemon = {
    id: number;
    name: string;
    height: number;
    weight: number;
    generation: number;
    is_default: boolean;
    types: string[];
    stats: Record<string, number>;
    sprites: {
        sprite: string | null;
        default: string | null;
        defaultShiny: string | null;
        dominantColor: string | null;
    };
    evolutions: EvolutionNode | null;
};

export type DamageRelations = {
    doubleDamageTo: string[];
    doubleDamageFrom: string[];
    halfDamageTo: string[];
    halfDamageFrom: string[];
    noDamageTo: string[];
    noDamageFrom: string[];
};

export type TypeData = {
    id: number;
    name: string;
    damageRelations: DamageRelations;
};

export type TypeEffectivenessEntry = {
    type: string;
    multiplier: 0 | 0.25 | 0.5 | 1 | 2 | 4;
};

export type TypeEffectiveness = {
    immune: TypeEffectivenessEntry[];
    resistant: TypeEffectivenessEntry[];
    normal: TypeEffectivenessEntry[];
    weak: TypeEffectivenessEntry[];
};

export type PokemonDetail = Pokemon & {
    typeEffectiveness: TypeEffectiveness;
};
