import type { Pokemon } from '~/types/pokemon';
import { useVirtualizer } from '@tanstack/vue-virtual';

export function usePokemonVirtualizer(
    parentRef: Ref<HTMLElement | null>,
    allPokemon: ComputedRef<Pokemon[]>,
    hasNextPage: Ref<boolean>,
    isFetchingNextPage: Ref<boolean>,
    fetchNextPage: () => unknown,
) {
    const savedScrollPosition = ref(0);

    const virtualizer = useVirtualizer(computed(() => ({
        count: hasNextPage.value ? allPokemon.value.length + 1 : allPokemon.value.length,
        getScrollElement: () => parentRef.value,
        estimateSize: () => 60, // estimated row height in px – adjust to match actual card height
        overscan: 5, // items rendered outside viewport to prevent blank flashes
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

    onActivated(async () => {
        await nextTick();
        if (parentRef.value) {
            parentRef.value.scrollTop = savedScrollPosition.value;
        }
        virtualizer.value.measure();
    });

    return { virtualItems, totalSize };
}
