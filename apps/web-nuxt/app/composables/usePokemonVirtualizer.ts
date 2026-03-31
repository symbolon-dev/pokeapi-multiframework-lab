import type { Pokemon } from '~/types/pokemon';
import { useVirtualizer } from '@tanstack/vue-virtual';

// TODO: Fix keepalive for <6 cards per row, which causes the virtualizer to lose track of scroll position. This is likely due to the way the virtualizer calculates item positions based on the number of lanes and container width, which can change when the number of cards per row changes.
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
    const columnWidth = computed(() => containerWidth.value / lanes.value);

    const virtualizer = useVirtualizer(computed(() => ({
        count: hasNextPage.value ? allPokemon.value.length + 1 : allPokemon.value.length,
        getScrollElement: () => parentRef.value,
        estimateSize: () => columnWidth.value + 42, // estimated row height in px – adjust to match actual card height
        overscan: 6, // items rendered outside viewport to prevent blank flashes
        lanes: lanes.value,
        gap: 16,
    })));

    watch([lanes, containerWidth], () => {
        virtualizer.value.measure();
    });

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

    onActivated(async () => {
        await nextTick();
        if (parentRef.value) {
            parentRef.value.scrollTop = savedScrollPosition.value;
        }
        virtualizer.value.measure();
    });

    return { virtualItems, totalSize, measureElement: virtualizer.value.measureElement };
}
