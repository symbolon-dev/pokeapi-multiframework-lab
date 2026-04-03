<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

type Props = {
    data: PokemonDetail | undefined;
};

defineProps<Props>();
</script>

<template>
    <div v-if="data?.typeEffectiveness" class="mt-6">
        <h2 class="mb-4 text-xl font-semibold">
            Type Effectiveness
        </h2>

        <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg border p-3">
                <p class="mb-2 text-sm font-medium text-red-500">
                    Weak (2×)
                </p>
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="item in data.typeEffectiveness.weak"
                        :key="item.type"
                        class="
                            rounded bg-red-500/20 px-2 py-1 text-xs text-red-600
                            capitalize
                        "
                    >
                        {{ item.type }} ({{ item.multiplier }}×)
                    </span>
                </div>
            </div>

            <div class="rounded-lg border p-3">
                <p class="mb-2 text-sm font-medium text-green-500">
                    Resistant
                </p>
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="item in data.typeEffectiveness.resistant"
                        :key="item.type"
                        class="
                            rounded bg-green-500/20 px-2 py-1 text-xs
                            text-green-600 capitalize
                        "
                    >
                        {{ item.type }} ({{ item.multiplier }}×)
                    </span>
                </div>
            </div>

            <div class="rounded-lg border p-3">
                <p class="mb-2 text-sm font-medium text-gray-500">
                    Immune (0×)
                </p>
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="item in data.typeEffectiveness.immune"
                        :key="item.type"
                        class="
                            rounded bg-gray-500/20 px-2 py-1 text-xs
                            text-gray-600 capitalize
                        "
                    >
                        {{ item.type }} (0×)
                    </span>
                </div>
            </div>

            <div class="rounded-lg border p-3">
                <p class="mb-2 text-sm font-medium text-muted-foreground">
                    Normal (1×)
                </p>
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="item in data.typeEffectiveness.normal"
                        :key="item.type"
                        class="
                            rounded bg-secondary px-2 py-1 text-xs
                            text-foreground capitalize
                        "
                    >
                        {{ item.type }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
