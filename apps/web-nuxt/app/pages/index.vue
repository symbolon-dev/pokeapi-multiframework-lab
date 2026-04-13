<script setup lang="ts">
import { usePokemonQuery } from '../composables/usePokemonQuery';
import { usePokemonUrlState } from '../composables/usePokemonUrlState';

const { searchTerm, selectedTypes, generation, sortOrder } = usePokemonUrlState();

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
    <div class="flex h-svh flex-col overflow-hidden">
        <div class="flex flex-wrap justify-between gap-4 pb-4">
            <PokemonListSearchInput
                v-model="searchTerm"
                class="w-80"
            />

            <div class="flex gap-4">
                <PokemonListGenerationSelect
                    v-model="generation"
                    :generations="generations"
                />

                <PokemonListSortSelect
                    v-model="sortOrder"
                />
            </div>
        </div>

        <PokemonListTypeFilter
            v-model:selected-types="selectedTypes"
            class="pb-4"
            :types="types"
        />

        <PokemonListVirtualList
            :all-pokemon="allPokemon"
            :has-next-page="hasNextPage"
            :is-fetching-next-page="isFetchingNextPage"
            :fetch-next-page="fetchNextPage"
            :is-loading="status === 'pending' || isFetching"
            :is-error="error != null"
            :is-empty="status === 'success' && allPokemon.length === 0"
            :error-message="error?.message"
            @retry="refetchPokemon"
        />
    </div>
</template>
