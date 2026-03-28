<script setup lang="ts">
import type { SortOrder } from '../types/pokemon';
import { usePokemonQuery } from '../composables/usePokemonQuery';
import { usePokemonVirtualizer } from '../composables/usePokemonVirtualizer';

const searchTerm = ref('');
const selectedTypes = ref<string[]>([]);
const generation = ref<number | undefined>();
const sortOrder = ref<SortOrder>('id-asc');
const parentRef = ref<HTMLElement | null>(null);

const { allPokemon, hasNextPage, isFetchingNextPage, fetchNextPage, status } = usePokemonQuery(
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
                <option :value="1">Gen 1</option>
                <option :value="2">Gen 2</option>
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

        <div v-if="status === 'pending'">
            Loading...
        </div>

        <!-- TODO: adjust height to match actual card height once design is finalized (see usePokemonVirtualizer estimateSize) -->
        <!-- Virtual scroller: inline styles required – TanStack Virtual needs exact px values at runtime, Tailwind classes won't work here -->
        <div
            v-else
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
                    <template v-if="item.index >= allPokemon.length">
                        <div>Loading more...</div>
                    </template>
                    <template v-else>
                        {{ allPokemon[item.index]?.id }}
                        {{ allPokemon[item.index]?.name }}
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
