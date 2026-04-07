<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

type Props = {
    data: PokemonDetail | undefined;
};

defineProps<Props>();

const isShiny = ref(false);
</script>

<template>
    <div>
        <div
            v-if="data?.sprites.default"
            :style="{ backgroundColor: data.sprites.dominantColor ?? undefined }"
            class="my-4 rounded-lg"
            :class="[isShiny ? 'hidden' : 'block']"
        >
            <img
                :src="data.sprites.default"
                class="aspect-square w-full rounded-lg object-cover"
                alt="Pokemon Image"
            >
        </div>
        <div
            v-if="data?.sprites.defaultShiny"
            :style="{ backgroundColor: data.sprites.dominantColor ?? undefined }"
            class="my-4 rounded-lg"
            :class="[isShiny ? 'block' : 'hidden']"
        >
            <img
                :src="data.sprites.defaultShiny"
                class="aspect-square w-full rounded-lg object-cover"
                alt="Pokemon Image"
            >
        </div>
        <div class="flex items-center gap-2 self-end">
            <Label for="switch" aria-label="Shiny Toggle">
                Shiny Toggle
                <Switch v-model="isShiny" aria-label="Shiny Toggle" />
            </Label>
        </div>
    </div>
</template>
