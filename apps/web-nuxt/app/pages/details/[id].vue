<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const id = route.params.id as string;

const { data: pokemon } = await useFetch(`/api/pokemon/${id}`);
</script>

<template>
    <div class="p-4">
        <button @click="router.back()">
            Back
        </button>
        <pre>{{ JSON.stringify(pokemon, null, 2) }}</pre>
    </div>
</template>
