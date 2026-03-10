<script setup lang="ts">
const searchTerm = ref('');

const { data } = useLazyFetch('/api/search', {
    query: { searchTerm },
    watch: [searchTerm],
});
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

        <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
</template>
