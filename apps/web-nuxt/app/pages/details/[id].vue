<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

const route = useRoute();
const router = useRouter();

const id = route.params.id as string;

const { data } = await useAsyncData(`pokemon-detail-${id}`, async () => {
    return $fetch<PokemonDetail>(`/api/pokemon/${id}`);
});
</script>

<template>
    <div class="p-4">
        <button @click="router.back()">
            Back
        </button>
        <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
</template>
