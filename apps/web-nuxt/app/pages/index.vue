<script setup lang="ts">
import type { SortOrder } from '../types/pokemon';
import { usePokemonQuery } from '../composables/usePokemonQuery';

const searchTerm = ref('');
const selectedTypes = ref<string[]>([]);
const generation = ref<string | number>('all');
const sortOrder = ref<SortOrder>('id-asc');
const isMounted = ref(false);

const { data: generations, error: generationsError, pending: generationsPending, refresh: refreshGenerations } = useFetch<number[]>('/api/generations');
const { data: types, error: typesError, pending: typesPending, refresh: refreshTypes } = useFetch<string[]>('/api/types');

const { allPokemon, hasNextPage, isFetchingNextPage, fetchNextPage, status, error, isFetching, refetch: refetchPokemon } = usePokemonQuery(
    searchTerm,
    selectedTypes,
    generation,
    sortOrder,
);

onMounted(() => {
    isMounted.value = true;
});

const isLoading = computed(() => isMounted.value && (status.value === 'pending' || isFetching.value));
const hasError = computed(() => isMounted.value && error.value !== null);
const isEmpty = computed(() => isMounted.value && status.value === 'success' && allPokemon.value.length === 0);
const isInitialLoading = computed(() => generationsPending.value || typesPending.value);
const showPokemonSection = computed(() => isMounted.value && !hasError.value && !isLoading.value && !isEmpty.value);

async function retryFetch() {
    await refetchPokemon();
}

async function retryFilters() {
    await refreshGenerations();
    await refreshTypes();
}
</script>

<template>
    <div class="flex h-screen flex-col">
        <div v-if="isInitialLoading" class="my-4 flex flex-wrap gap-2">
            <div
                class="
                    h-10 w-64 animate-pulse rounded bg-gray-200
                    dark:bg-gray-700
                "
            />
            <div
                class="
                    h-10 w-40 animate-pulse rounded bg-gray-200
                    dark:bg-gray-700
                "
            />
            <div
                class="
                    h-10 w-40 animate-pulse rounded bg-gray-200
                    dark:bg-gray-700
                "
            />
        </div>

        <div
            v-else-if="generationsError || typesError" class="
                my-4 rounded-lg border border-red-200 bg-red-50 p-4
                dark:border-red-800 dark:bg-red-900/20
            "
        >
            <p
                class="
                    text-sm text-red-600
                    dark:text-red-400
                "
            >
                Failed to load filters. Please try again.
            </p>
            <Button
                variant="outline"
                size="sm"
                class="mt-2"
                @click="retryFilters"
            >
                Retry
            </Button>
        </div>

        <div v-else class="my-4 flex flex-wrap gap-2">
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
            v-if="!isInitialLoading && !generationsError && !typesError"
            v-model:selected-types="selectedTypes"
            :types="types"
        />

        <div v-if="hasError" class="flex flex-1 items-center justify-center">
            <div class="text-center">
                <p
                    class="
                        mb-2 text-lg font-semibold text-red-600
                        dark:text-red-400
                    "
                >
                    Failed to load Pokémon
                </p>
                <p
                    class="
                        mb-4 text-sm text-gray-500
                        dark:text-gray-400
                    "
                >
                    {{ error?.message || 'An unexpected error occurred' }}
                </p>
                <Button @click="retryFetch">
                    Try Again
                </Button>
            </div>
        </div>

        <div
            v-else-if="isLoading" class="
                flex flex-1 items-center justify-center
            "
        >
            <div class="flex flex-col items-center gap-2">
                <div
                    class="
                        h-8 w-8 animate-spin rounded-full border-4
                        border-gray-300 border-t-red-500
                    "
                />
                <p
                    class="
                        text-sm text-gray-500
                        dark:text-gray-400
                    "
                >
                    Loading Pokémon...
                </p>
            </div>
        </div>

        <div v-else-if="isEmpty" class="flex flex-1 items-center justify-center">
            <div class="text-center">
                <p
                    class="
                        mb-2 text-lg font-semibold text-gray-700
                        dark:text-gray-300
                    "
                >
                    No Pokémon found
                </p>
                <p
                    class="
                        text-sm text-gray-500
                        dark:text-gray-400
                    "
                >
                    Try adjusting your search or filters
                </p>
            </div>
        </div>

        <PokemonListVirtualList
            v-else-if="showPokemonSection"
            :all-pokemon="allPokemon"
            :has-next-page="hasNextPage"
            :is-fetching-next-page="isFetchingNextPage"
            :fetch-next-page="fetchNextPage"
        />

        <div v-else class="flex flex-1 items-center justify-center">
            <div class="flex flex-col items-center gap-2">
                <div
                    class="
                        h-8 w-8 animate-spin rounded-full border-4
                        border-gray-300 border-t-red-500
                    "
                />
                <p
                    class="
                        text-sm text-gray-500
                        dark:text-gray-400
                    "
                >
                    Initializing...
                </p>
            </div>
        </div>
    </div>
</template>
