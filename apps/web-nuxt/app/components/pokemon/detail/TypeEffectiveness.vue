<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

type Props = {
    data: PokemonDetail | undefined;
};

defineProps<Props>();
</script>

<template>
    <div
        v-if="data?.typeEffectiveness" class="
            rounded-xl border bg-card p-6 shadow-sm
        "
    >
        <h2 class="mb-4 text-xl font-bold">
            Type Effectiveness
        </h2>

        <div class="space-y-6">
            <div
                v-if="data.typeEffectiveness.weak.length > 0" class="
                    space-y-2 border-b pb-4
                "
            >
                <h3 class="text-sm font-semibold">
                    Weak Against
                </h3>
                <div class="flex flex-wrap gap-1.5">
                    <PokemonSharedTypeBadge
                        v-for="item in data.typeEffectiveness.weak"
                        :key="item.type"
                        :type="item.type"
                    />
                </div>
            </div>

            <div
                v-if="data.typeEffectiveness.resistant.length > 0" class="
                    space-y-2 border-b pb-4
                "
            >
                <h3 class="text-sm font-semibold">
                    Resistant To
                </h3>
                <div class="flex flex-wrap gap-1.5">
                    <PokemonSharedTypeBadge
                        v-for="item in data.typeEffectiveness.resistant"
                        :key="item.type"
                        :type="item.type"
                    />
                </div>
            </div>

            <div
                v-if="data.typeEffectiveness.immune.length > 0" class="
                    space-y-2 border-b pb-4
                "
            >
                <h3 class="text-sm font-semibold">
                    Immune To
                </h3>
                <div class="flex flex-wrap gap-1.5">
                    <PokemonSharedTypeBadge
                        v-for="item in data.typeEffectiveness.immune"
                        :key="item.type"
                        :type="item.type"
                    />
                </div>
            </div>

            <div
                v-if="data.typeEffectiveness.normal.length > 0" class="
                    space-y-2
                "
            >
                <h3 class="text-sm font-semibold">
                    Normal Damage
                </h3>
                <div class="flex flex-wrap gap-1.5">
                    <PokemonSharedTypeBadge
                        v-for="item in data.typeEffectiveness.normal"
                        :key="item.type"
                        :type="item.type"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
