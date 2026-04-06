<script setup lang="ts">
import type { Pokemon } from '~/types/pokemon';

type Props = {
    pokemon: Pokemon | undefined;
};

defineProps<Props>();
</script>

<template>
    <NuxtLink :to="`/details/${pokemon?.id}`">
        <Card>
            <CardContent>
                <div
                    v-if="pokemon?.sprites.default"
                    :style="{ backgroundColor: pokemon.sprites.dominantColor ?? undefined }"
                    class="relative aspect-square w-full"
                >
                    <div
                        class="
                            absolute inset-0 z-0 bg-white/25
                            dark:bg-white/5
                        "
                    />
                    <img
                        :src="pokemon.sprites.default"
                        class="relative z-10 aspect-square w-full object-cover"
                        :alt="pokemon.name"
                    >
                </div>
            </CardContent>
            <CardFooter>
                <span class="text-xs text-gray-400">
                    #{{ String(pokemon?.id).padStart(4, '0') }}
                </span>
                <span class="font-semibold">
                    {{ pokemon?.name }}
                </span>
                <div class="flex gap-1">
                    <span
                        v-for="type in pokemon?.types"
                        :key="type"
                    >
                        {{ type }}
                    </span>
                </div>
            </CardFooter>
        </Card>
    </NuxtLink>
</template>
