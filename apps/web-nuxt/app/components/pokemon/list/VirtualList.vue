<script setup lang="ts">
import type { Pokemon } from '@repo/types';

type Props = {
    allPokemon: Pokemon[];
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    isLoading: boolean;
    isError: boolean;
    isEmpty: boolean;
    errorMessage?: string;
};

type Emits = {
    (e: 'retry'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

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
        class="virtual-list"
        style="flex: 1; overflow-y: auto; min-height: 0; position: relative;"
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

        <div
            v-if="isMounted && (isLoading || isError || isEmpty)"
            style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;"
        >
            <div v-if="isLoading">
                Loading...
            </div>
            <div v-else-if="isError">
                <p>{{ errorMessage ?? 'Something went wrong' }}</p>
                <Button @click="emit('retry')">
                    Retry
                </Button>
            </div>
            <div v-else-if="isEmpty">
                No Pokémon found
            </div>
        </div>
    </div>
</template>

<style scoped>
.virtual-list::-webkit-scrollbar {
    display: none; /* WebKit */
}

.virtual-list {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>
