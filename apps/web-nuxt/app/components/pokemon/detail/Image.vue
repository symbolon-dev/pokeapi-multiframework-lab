<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

type Props = {
    data: PokemonDetail | undefined;
};

defineProps<Props>();

const isShiny = ref(false);
</script>

<template>
    <div class="flex flex-col gap-4">
        <div
            v-if="data"
            :style="{ backgroundColor: data.sprites.dominantColor ?? undefined }"
            class="relative overflow-hidden rounded-2xl shadow-lg"
        >
            <div class="relative aspect-square w-full">
                <Transition
                    name="fade"
                    mode="out-in"
                >
                    <NuxtImg
                        v-if="!isShiny && data.sprites.default"
                        :src="data.sprites.default"
                        :alt="`${data.name} sprite`"
                        width="512"
                        height="512"
                        class="size-full object-contain p-8"
                    />
                    <NuxtImg
                        v-else-if="isShiny && data.sprites.defaultShiny"
                        :src="data.sprites.defaultShiny"
                        :alt="`${data.name} shiny sprite`"
                        width="512"
                        height="512"
                        class="size-full object-contain p-8"
                    />
                </Transition>
            </div>
        </div>

        <div
            v-if="data?.sprites.defaultShiny"
            class="
                flex items-center justify-between rounded-xl border bg-card p-6
            "
        >
            <span class="text-sm font-medium">
                Shiny
            </span>
            <Switch v-model="isShiny" />
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
