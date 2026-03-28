<script setup lang="ts">
import type { SortOrder } from '../types/pokemon';
import { usePokemonQuery } from '../composables/usePokemonQuery';
import { usePokemonVirtualizer } from '../composables/usePokemonVirtualizer';

const searchTerm = ref('');
const selectedTypes = ref<string[]>([]);
const generation = ref<number | undefined>();
const sortOrder = ref<SortOrder>('id-asc');
const parentRef = ref<HTMLElement | null>(null);

const { data: generations } = useFetch<number[]>('/api/generations');
const { data: types } = useFetch<string[]>('/api/types');

function toggleType(type: string) {
    const idx = selectedTypes.value.indexOf(type);
    if (idx !== -1) {
        selectedTypes.value.splice(idx, 1);
    }
    else if (selectedTypes.value.length < 2) {
        selectedTypes.value.push(type);
    }
}

const { allPokemon, hasNextPage, isFetchingNextPage, fetchNextPage } = usePokemonQuery(
    searchTerm,
    selectedTypes,
    generation,
    sortOrder,
);

const { virtualItems, totalSize } = usePokemonVirtualizer(
    parentRef,
    allPokemon,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
);
</script>

<template>
    <div>
        <label for="search">
            <input
                id="search"
                v-model="searchTerm"
                placeholder="Search..."
                class="rounded border border-gray-300 px-2 py-1"
            >
        </label>

        <label for="generation">
            <select id="generation" v-model="generation">
                <option :value="undefined">All Generations</option>
                <option
                    v-for="gen in generations"
                    :key="gen"
                    :value="gen"
                >
                    Gen {{ gen }}
                </option>
            </select>
        </label>

        <label for="sort">
            <select id="sort" v-model="sortOrder">
                <option value="id-asc">
                    ID asc
                </option>
                <option value="id-desc">
                    ID desc
                </option>
                <option value="name-asc">
                    Name A-Z
                </option>
                <option value="name-desc">
                    Name Z-A
                </option>
            </select>
        </label>

        <div class="flex flex-wrap gap-2">
            <button
                v-for="type in types"
                :key="type"
                type="button"
                :disabled="!selectedTypes.includes(type) && selectedTypes.length >= 2"
                class="
                    rounded-full border px-3 py-1 text-sm capitalize
                    transition-colors
                " :class="[
                    selectedTypes.includes(type)
                        ? 'border-transparent bg-blue-500 text-white'
                        : `
                            border-gray-300 bg-white text-gray-700
                            hover:border-blue-400
                        `,
                    !selectedTypes.includes(type) && selectedTypes.length >= 2
                        ? 'cursor-not-allowed opacity-40'
                        : 'cursor-pointer',
                ]"
                @click="toggleType(type)"
            >
                {{ type }}
            </button>
        </div>

        <p v-if="selectedTypes.length >= 2" class="text-xs text-gray-400">
            Max. 2 types selected
        </p>

        <!-- TODO: adjust height to match actual card height once design is finalized (see usePokemonVirtualizer estimateSize) -->
        <!-- Virtual scroller: inline styles required – TanStack Virtual needs exact px values at runtime, Tailwind classes won't work here -->
        <div
            ref="parentRef"
            style="height: 600px; overflow-y: auto;"
        >
            <div :style="{ height: `${totalSize}px`, position: 'relative' }">
                <div
                    v-for="item in virtualItems"
                    :key="JSON.stringify(item)"
                    :style="{
                        position: 'absolute',
                        top: 0,
                        transform: `translateY(${item.start}px)`,
                        height: `${item.size}px`,
                        width: '100%',
                    }"
                >
                    <NuxtLink
                        :to="`/details/${allPokemon[item.index]?.id}`"
                        class="capitalize"
                    >
                        ID: {{ allPokemon[item.index]?.id }} |
                        Name: {{ allPokemon[item.index]?.name }} |
                        Generation: {{ allPokemon[item.index]?.generation }} |
                        Types: {{ allPokemon[item.index]?.types.join(', ') }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
