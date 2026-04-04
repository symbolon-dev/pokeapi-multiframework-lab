<script setup lang="ts">
import type { Pokemon } from '~/types/pokemon';

type Props = {
    allPokemon: Pokemon[];
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
};

const props = defineProps<Props>();

const parentRef = ref<HTMLElement | null>(null);
const columns = ref(4);
const containerWidth = ref(0);
const isMounted = ref(false);

onMounted(() => {
    isMounted.value = true;
});

const allPokemonRef = toRef(props, 'allPokemon');
const hasNextPageRef = toRef(props, 'hasNextPage');
const isFetchingNextPageRef = toRef(props, 'isFetchingNextPage');

const { virtualItems, totalSize } = usePokemonVirtualizer(
    parentRef,
    allPokemonRef as ComputedRef<Pokemon[]>,
    hasNextPageRef,
    isFetchingNextPageRef,
    () => props.fetchNextPage(),
    columns,
    containerWidth,
);

const columnWidth = computed(() => containerWidth.value / columns.value);

useResizeObserver(parentRef, (entries) => {
    const entry = entries[0];
    if (!entry)
        return;
    containerWidth.value = entry.contentRect.width;
    columns.value = Math.max(1, Math.floor(entry.contentRect.width / 220));
});
</script>

<template>
    <div
        ref="parentRef"
        style="flex: 1; overflow-y: auto; min-height: 0;"
    >
        <div v-if="isMounted" :style="{ height: `${totalSize}px`, position: 'relative' }">
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
                <PokemonListItem :pokemon="allPokemon[item.index]" />
            </div>
        </div>

        <!-- <div
            v-if="isFetchingNextPage" class="
                flex items-center justify-center py-4
            "
        >
            <div class="flex items-center gap-2">
                <div
                    class="
                        h-5 w-5 animate-spin rounded-full border-2
                        border-gray-300 border-t-red-500
                    "
                />
                <span
                    class="
                        text-sm text-gray-500
                        dark:text-gray-400
                    "
                >
                    Loading more...
                </span>
            </div>
        </div> -->
    </div>
</template>
