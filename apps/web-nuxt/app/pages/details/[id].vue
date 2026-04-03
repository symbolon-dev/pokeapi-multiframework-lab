<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

const router = useRouter();

const route = useRoute();
const id = route.params.id as string;

const isShiny = ref(false);

const { data } = await useAsyncData(`pokemon-detail-${id}`, async () => {
    return $fetch<PokemonDetail>(`/api/pokemon/${id}`);
});
</script>

<template>
    <div class="p-4">
        <Button @click="router.push('/')">
            Back
        </Button>

        <PokemonDetailImage
            v-model:is-shiny="isShiny"
            :data="data"
        />

        <PokemonDetailInfo :data="data" />

        <PokemonDetailStats :data="data" />

        <PokemonDetailEvolutions :data="data" />

        <PokemonDetailTypeEffectiveness :data="data" />
    </div>
</template>
