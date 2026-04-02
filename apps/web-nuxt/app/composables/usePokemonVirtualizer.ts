import type { Pokemon } from '~/types/pokemon';
import { useVirtualizer } from '@tanstack/vue-virtual';

export function usePokemonVirtualizer(
    parentRef: Ref<HTMLElement | null>,
    allPokemon: ComputedRef<Pokemon[]>,
    hasNextPage: Ref<boolean>,
    isFetchingNextPage: Ref<boolean>,
    fetchNextPage: () => unknown,
    lanes: Ref<number>,
    containerWidth: Ref<number>,
) {
    const savedScrollPosition = ref(0);
    const hasRestored = ref(false);

    const columnWidth = computed(() => containerWidth.value / lanes.value);

    const virtualizer = useVirtualizer(computed(() => ({
        count: hasNextPage.value ? allPokemon.value.length + 1 : allPokemon.value.length,
        getScrollElement: () => parentRef.value,
        estimateSize: () => columnWidth.value + 48,
        overscan: 6,
        lanes: lanes.value,
        gap: 16,
    })));

    const virtualItems = computed(() => virtualizer.value.getVirtualItems());
    const totalSize = computed(() => virtualizer.value.getTotalSize());

    watchEffect(() => {
        const last = virtualItems.value.at(-1);
        if (!last || !hasNextPage.value || isFetchingNextPage.value)
            return;

        if (last.index >= allPokemon.value.length) {
            void fetchNextPage();
        }
    });

    onMounted(() => {
        const el = parentRef.value;
        if (!el)
            return;
        el.addEventListener('scroll', () => {
            savedScrollPosition.value = el.scrollTop;
        }, { passive: true });
    });

    onActivated(() => {
        hasRestored.value = false;
    });

    watch([lanes, containerWidth], async () => {
        if (containerWidth.value === 0)
            return;
        virtualizer.value.measure();
        if (!hasRestored.value) {
            hasRestored.value = true;
            await nextTick(() => {
                if (parentRef.value) {
                    parentRef.value.scrollTop = savedScrollPosition.value;
                }
            });
        }
    });

    return { virtualItems, totalSize };
}
