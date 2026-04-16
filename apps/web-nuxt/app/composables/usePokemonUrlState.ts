import type { LocationQueryValue } from 'vue-router';
import type { SortOrder } from '@/types/pokemon';
import { useDebounceFn } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';

const VALID_SORT_ORDERS: SortOrder[] = ['id-asc', 'id-desc', 'name-asc', 'name-desc'];

export function usePokemonUrlState() {
    const route = useRoute();
    const router = useRouter();

    function parseTypes(value: LocationQueryValue | LocationQueryValue[] | undefined): string[] {
        if (value == null)
            return [];
        const types = typeof value === 'string' ? value.split(',') : value;
        return types.filter((t): t is string => typeof t === 'string' && t.length > 0).slice(0, 2);
    }

    function parseGeneration(value: LocationQueryValue | LocationQueryValue[] | undefined): string | number {
        if (value == null || typeof value !== 'string')
            return 'all';
        if (value === 'all')
            return 'all';
        const num = Number(value);
        if (Number.isNaN(num) || num < 1)
            return 'all';
        return num;
    }

    function parseSortOrder(value: LocationQueryValue | LocationQueryValue[] | undefined): SortOrder {
        if (typeof value === 'string' && VALID_SORT_ORDERS.includes(value as SortOrder)) {
            return value as SortOrder;
        }
        return 'id-asc';
    }

    const searchTerm = ref<string>(
        typeof route.query.search === 'string' ? route.query.search : '',
    );

    const selectedTypes = ref<string[]>(
        parseTypes(route.query.types),
    );

    const generation = ref<string | number>(
        parseGeneration(route.query.generation),
    );

    const sortOrder = ref<SortOrder>(
        parseSortOrder(route.query.sort),
    );

    const updateUrl = useDebounceFn(() => {
        const query: Record<string, string> = {};

        if (searchTerm.value.length > 0) {
            query.search = searchTerm.value;
        }
        if (selectedTypes.value.length > 0) {
            query.types = selectedTypes.value.join(',');
        }
        if (generation.value !== 'all') {
            query.generation = String(generation.value);
        }
        if (sortOrder.value !== 'id-asc') {
            query.sort = sortOrder.value;
        }

        void router.replace({ query });
    }, 300);

    watch(
        [searchTerm, selectedTypes, generation, sortOrder],
        updateUrl,
        { deep: true },
    );

    watch(
        () => route.query,
        (newQuery) => {
            const newSearch = typeof newQuery.search === 'string' ? newQuery.search : '';
            if (searchTerm.value !== newSearch) {
                searchTerm.value = newSearch;
            }

            const newTypes = parseTypes(newQuery.types);
            if (JSON.stringify(selectedTypes.value) !== JSON.stringify(newTypes)) {
                selectedTypes.value = newTypes;
            }

            const newGeneration = parseGeneration(newQuery.generation);
            if (generation.value !== newGeneration) {
                generation.value = newGeneration;
            }

            const newSortOrder = parseSortOrder(newQuery.sort);
            if (sortOrder.value !== newSortOrder) {
                sortOrder.value = newSortOrder;
            }
        },
    );

    const hasNonDefaultValues = computed(() => {
        return searchTerm.value !== ''
            || selectedTypes.value.length > 0
            || generation.value !== 'all'
            || sortOrder.value !== 'id-asc';
    });

    const resetFilters = () => {
        searchTerm.value = '';
        selectedTypes.value = [];
        generation.value = 'all';
        sortOrder.value = 'id-asc';
    };

    return {
        searchTerm,
        selectedTypes,
        generation,
        sortOrder,
        hasNonDefaultValues,
        resetFilters,
    };
}
