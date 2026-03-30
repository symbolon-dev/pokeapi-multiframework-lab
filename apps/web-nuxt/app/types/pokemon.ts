export type SortOrder = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc';

export type Filters = {
    name: string;
    types: string[];
    generation: number | undefined;
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
    };
    evolutions: {
        name: string;
        id: number;
        sprite: string;
        minLevel?: number;
    }[];
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
