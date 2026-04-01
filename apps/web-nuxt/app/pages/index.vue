<script setup lang="ts">
import type { SortOrder } from '../types/pokemon';
import { usePokemonQuery } from '../composables/usePokemonQuery';
import { usePokemonVirtualizer } from '../composables/usePokemonVirtualizer';

const searchTerm = ref('');
const selectedTypes = ref<string[]>([]);
const generation = ref<number | undefined>();
const sortOrder = ref<SortOrder>('id-asc');
const parentRef = ref<HTMLElement | null>(null);
const columns = ref(4);

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

const containerWidth = ref(0);

const { virtualItems, totalSize, measureElement } = usePokemonVirtualizer(
    parentRef,
    allPokemon,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    columns,
    containerWidth,
);

const columnWidth = computed(() => containerWidth.value / columns.value);

useResizeObserver(parentRef, (entries) => {
    const entry = entries[0];
    if (!entry)
        return;
    const width = entry.contentRect.width;
    containerWidth.value = width;
    columns.value = Math.max(1, Math.floor(width / 220));
});
</script>

<template>
    <div class="flex h-full flex-col">
        <div class="mb-3 flex flex-wrap items-center gap-2">
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

            <p v-if="selectedTypes.length >= 2" class="text-xs text-gray-400">
                Max. 2 types selected
            </p>
        </div>

        <div class="mb-3 flex flex-wrap gap-2">
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

        <!-- Virtual scroller: inline styles required – TanStack Virtual needs exact px values at runtime, Tailwind classes won't work here -->
        <div
            ref="parentRef"
            style="flex: 1; overflow-y: auto; min-height: 0;"
        >
            <div :style="{ height: `${totalSize}px`, position: 'relative' }">
                <div
                    v-for="item in virtualItems"
                    :ref="measureElement"
                    :key="String(item.key)"
                    :data-index="item.index"
                    :style="{
                        position: 'absolute',
                        top: 0,
                        transform: `translate(${item.lane * columnWidth}px, ${item.start}px)`,
                        width: `${columnWidth}px`,
                        padding: '0 8px',
                        boxSizing: 'border-box',
                    }"
                >
                    <NuxtLink
                        :to="`/details/${allPokemon[item.index]?.id}`"
                    >
                        <div class="overflow-hidden rounded-lg bg-white">
                            <NuxtImg
                                v-if="allPokemon[item.index]?.sprites.default"
                                :src="allPokemon[item.index]?.sprites.default ?? ''"
                                :style="{
                                    backgroundColor: allPokemon[item.index]?.sprites.dominantColor ?? undefined,
                                }"
                                class="aspect-square w-full object-cover"
                                :alt="allPokemon[item.index]?.name ?? ''"
                            />
                            <div class="px-2 py-1">
                                <span class="text-xs text-gray-400">
                                    #{{ String(allPokemon[item.index]?.id).padStart(4, '0') }}
                                </span>
                                <span class="ml-1 capitalize">
                                    {{ allPokemon[item.index]?.name }}
                                </span>
                                <div class="mt-1 flex gap-1">
                                    <span
                                        v-for="type in allPokemon[item.index]?.types"
                                        :key="type"
                                        class="
                                            rounded-full bg-gray-100 px-2 py-0.5
                                            text-xs capitalize
                                        "
                                    >
                                        {{ type }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
