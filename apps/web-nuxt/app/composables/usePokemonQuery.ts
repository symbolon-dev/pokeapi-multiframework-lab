import type { Filters, PokemonPage, SortOrder } from '@repo/types';
import type { Ref } from 'vue';
import { useInfiniteQuery } from '@tanstack/vue-query';
import { refDebounced } from '@vueuse/core';

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
        ...(filters.generation != null && filters.generation !== 'all' ? [['generation', String(filters.generation)] as [string, string]] : []),
        ...filters.types.map((type): [string, string] => ['types', type]),
    ];
    return new URLSearchParams(entries);
}

export function usePokemonQuery(
    searchTerm: Ref<string>,
    selectedTypes: Ref<string[]>,
    generation: Ref<string | number>,
    sortOrder: Ref<SortOrder>,
) {
    const debouncedSearchTerm = refDebounced(searchTerm, 300); // ms
    const debouncedTypes = refDebounced(selectedTypes, 200); // ms
    const debouncedGeneration = refDebounced(generation, 100); // ms
    const debouncedSortOrder = refDebounced(sortOrder, 100); // ms

    const filters = computed(() => ({
        name: debouncedSearchTerm.value,
        types: debouncedTypes.value,
        generation: debouncedGeneration.value,
        ...SORT_MAP[debouncedSortOrder.value],
    }));

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error, isFetching, refetch } = useInfiniteQuery({
        queryKey: ['pokemon', filters],
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) =>
            $fetch<PokemonPage>(`/api/search?${buildParams(filters.value, pageParam)}`),
        getNextPageParam: lastPage =>
            lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        staleTime: 30_000, // 30 seconds
        gcTime: 5 * 60_000, // 5 minutes
        retry: 2,
    });

    const allPokemon = computed(() =>
        data.value?.pages.flatMap(p => p.pokemon) ?? [],
    );

    const result = {
        allPokemon,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        status,
        error,
        isFetching,
        refetch,
    };

    return result;
}
