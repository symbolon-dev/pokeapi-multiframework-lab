<script setup lang="ts">
const { data } = await useFetch('/api/search');
</script>

<template>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
</template>
