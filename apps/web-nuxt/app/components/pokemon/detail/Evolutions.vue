<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

type Props = {
    data: PokemonDetail | undefined;
};

defineProps<Props>();
</script>

<template>
    <div v-if="data?.evolutions?.length" class="mt-6">
        <h2 class="mb-2 text-xl font-semibold">
            Evolutions
        </h2>

        <div class="flex items-center gap-4">
            <template v-for="(evo, index) in data.evolutions" :key="evo.id">
                <NuxtLink
                    :to="`/details/${evo.id}`"
                    class="flex flex-col items-center"
                >
                    <NuxtImg
                        :src="evo.sprite"
                        width="80"
                        height="80"
                        class="mb-1"
                    />
                    <span class="text-sm capitalize">
                        #{{ String(evo?.id).padStart(3, '0') }} {{ evo.name }}</span>
                    <span
                        v-if="evo.minLevel" class="
                            text-xs text-muted-foreground
                        "
                    >Lv. {{ evo.minLevel }}</span>
                </NuxtLink>

                <span v-if="index < data.evolutions.length - 1">
                    →
                </span>
            </template>
        </div>
    </div>
</template>
