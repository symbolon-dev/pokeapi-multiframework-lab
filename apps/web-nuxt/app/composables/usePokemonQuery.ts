import type { Filters, PokemonPage, SortOrder } from '../types/pokemon';
import { useInfiniteQuery } from '@tanstack/vue-query';

const LIMIT = 20;

const SORT_MAP: Record<SortOrder, { sort: string; order: string }> = {
    'id-asc': { sort: 'id', order: 'asc' },
    'id-desc': { sort: 'id', order: 'desc' },
    'name-asc': { sort: 'name', order: 'asc' },
    'name-desc': { sort: 'name', order: 'desc' },
};

function buildParams(filters: Filters, page: number): URLSearchParams {
    const entries: [string, string][] = [
        ['page', String(page)],
        ['limit', String(LIMIT)],
        ['sort', filters.sort],
        ['order', filters.order],
        ...(filters.name ? [['name', filters.name] as [string, string]] : []),
        ...(filters.generation != null ? [['generation', String(filters.generation)] as [string, string]] : []),
        ...filters.types.map((type): [string, string] => ['types', type]),
    ];
    return new URLSearchParams(entries);
}

export function usePokemonQuery(
    searchTerm: Ref<string>,
    selectedTypes: Ref<string[]>,
    generation: Ref<number | undefined>,
    sortOrder: Ref<SortOrder>,
) {
    const filters = computed(() => ({
        name: searchTerm.value,
        types: selectedTypes.value,
        generation: generation.value,
        ...SORT_MAP[sortOrder.value],
    }));

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ['pokemon', filters],
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) =>
            $fetch<PokemonPage>(`/api/search?${buildParams(filters.value, pageParam)}`),
        getNextPageParam: lastPage =>
            lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
    });

    const allPokemon = computed(() =>
        data.value?.pages.flatMap(p => p.pokemon) ?? [],
    );

    return { allPokemon, hasNextPage, isFetchingNextPage, fetchNextPage, status };
}
