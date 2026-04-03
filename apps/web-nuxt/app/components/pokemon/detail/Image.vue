<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

type Props = {
    data: PokemonDetail | undefined;
};

defineProps<Props>();

const isShiny = defineModel<boolean>('isShiny', { required: true });
</script>

<template>
    <div>
        <NuxtImg
            v-if="data?.sprites.default"
            :src="data.sprites.default"
            class="my-4 rounded-lg" :class="[isShiny ? 'hidden' : 'block']"
            :style="{ backgroundColor: data.sprites.dominantColor ?? undefined }"
            alt="Pokemon Image"
            width="200"
            height="200"
        />
        <NuxtImg
            v-if="data?.sprites.defaultShiny"
            :src="data.sprites.defaultShiny"
            class="my-4 rounded-lg" :class="[isShiny ? 'block' : 'hidden']"
            :style="{ backgroundColor: data.sprites.dominantColor ?? undefined }"
            alt="Pokemon Image"
            width="200"
            height="200"
        />
        <div class="flex items-center gap-2">
            <Label for="switch" aria-label="Shiny Toggle">
                Shiny Toggle
                <Switch v-model="isShiny" aria-label="Shiny Toggle" />
            </Label>
        </div>
    </div>
</template>
