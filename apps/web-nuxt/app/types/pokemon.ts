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
        url: string;
        minLevel?: number;
    }[];
};
