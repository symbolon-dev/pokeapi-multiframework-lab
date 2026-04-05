<script setup lang="ts">
import type { SortOrder } from '../types/pokemon';
import { usePokemonQuery } from '../composables/usePokemonQuery';

const searchTerm = ref('');
const selectedTypes = ref<string[]>([]);
const generation = ref<string | number>('all');
const sortOrder = ref<SortOrder>('id-asc');

const { data: generations } = useFetch<number[]>('/api/generations');
const { data: types } = useFetch<string[]>('/api/types');

const { allPokemon, hasNextPage, isFetchingNextPage, fetchNextPage, status, error, isFetching, refetch: refetchPokemon } = usePokemonQuery(
    searchTerm,
    selectedTypes,
    generation,
    sortOrder,
);
</script>

<template>
    <div class="flex min-h-0 flex-1 flex-col">
        <div class="my-4 flex flex-wrap gap-2">
            <PokemonListSearchInput
                v-model="searchTerm"
            />

            <PokemonListGenerationSelect
                v-model="generation"
                :generations="generations"
            />

            <PokemonListSortSelect
                v-model="sortOrder"
            />
        </div>

        <PokemonListTypeFilter
            v-model:selected-types="selectedTypes"
            :types="types"
        />

        <PokemonListVirtualList
            :all-pokemon="allPokemon"
            :has-next-page="hasNextPage"
            :is-fetching-next-page="isFetchingNextPage"
            :fetch-next-page="fetchNextPage"
            :is-loading="status === 'pending' || isFetching"
            :is-error="error !== null"
            :is-empty="status === 'success' && allPokemon.length === 0"
            :error-message="error?.message"
            @retry="refetchPokemon"
        />
    </div>
</template>
