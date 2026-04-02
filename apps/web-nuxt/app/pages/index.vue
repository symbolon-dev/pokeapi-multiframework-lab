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

const { virtualItems, totalSize } = usePokemonVirtualizer(
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
        <div class="my-4 flex flex-wrap gap-2">
            <Label for="search">
                <Input
                    v-model="searchTerm"
                    placeholder="Search by name or ID..."
                />
            </Label>

            <Label for="generation">
                <Select v-model="generation" default-value="undefined">
                    <SelectTrigger>
                        <SelectValue placeholder="All Generations" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem :value="undefined">
                            All Generations
                        </SelectItem>
                        <SelectItem v-for="gen in generations" :key="gen" :value="gen">
                            Gen {{ gen }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </Label>

            <Label for="sort">
                <Select v-model="sortOrder" default-value="id-asc">
                    <SelectTrigger>
                        <SelectValue placeholder="ID ↑" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="id-asc">
                            ID ↑
                        </SelectItem>
                        <SelectItem value="id-desc">
                            ID ↓
                        </SelectItem>
                        <SelectItem value="name-asc">
                            Name ↑
                        </SelectItem>
                        <SelectItem value="name-desc">
                            Name ↓
                        </SelectItem>
                    </SelectContent>
                </Select>
            </Label>
        </div>

        <div class="mb-6">
            <div class="mb-3 flex flex-wrap gap-2">
                <Badge
                    v-for="type in types"
                    :key="type"
                    :variant="[
                        selectedTypes.includes(type)
                            ? 'default'
                            : 'outline',
                    ]"
                    :disabled="!selectedTypes.includes(type) && selectedTypes.length >= 2"
                    :class="[
                        !selectedTypes.includes(type) && selectedTypes.length >= 2
                            ? 'cursor-not-allowed opacity-40'
                            : 'cursor-pointer',
                    ]"
                    @click="toggleType(type)"
                >
                    {{ type }}
                </Badge>
            </div>
            <p v-if="selectedTypes.length >= 2" class="text-sm text-gray-500">
                Max. 2 types selected
            </p>
        </div>

        <!-- Virtual scroller: inline styles required – TanStack Virtual needs exact px values at runtime, Tailwind classes won't work here -->
        <div
            ref="parentRef"
            style="flex: 1; overflow-y: auto; min-height: 0;"
        >
            <div :style="{ height: `${totalSize}px`, position: 'relative' }">
                <div
                    v-for="item in virtualItems"
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
                        <Card>
                            <CardContent>
                                <NuxtImg
                                    v-if="allPokemon[item.index]?.sprites.default"
                                    :src="allPokemon[item.index]?.sprites.default ?? ''"
                                    :style="{
                                        backgroundColor: allPokemon[item.index]?.sprites.dominantColor ?? undefined,
                                    }"
                                    class="aspect-square w-full object-cover"
                                    :alt="allPokemon[item.index]?.name ?? ''"
                                />
                            </CardContent>
                            <CardFooter>
                                <span class="text-xs text-gray-400">
                                    #{{ String(allPokemon[item.index]?.id).padStart(4, '0') }}
                                </span>
                                <span class="font-semibold">
                                    {{ allPokemon[item.index]?.name }}
                                </span>
                                <div class="flex gap-1">
                                    <span
                                        v-for="type in allPokemon[item.index]?.types"
                                        :key="type"
                                    >
                                        {{ type }}
                                    </span>
                                </div>
                            </CardFooter>
                        </Card>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
