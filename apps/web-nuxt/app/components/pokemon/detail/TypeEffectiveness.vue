<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';
import { AlertTriangle, Ban, Minus, Shield } from '@lucide/vue';

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

        <div
            class="
                grid gap-4
                sm:grid-cols-2
            "
        >
            <div v-if="data.typeEffectiveness.weak.length > 0" class="space-y-2">
                <div class="flex items-center gap-2">
                    <AlertTriangle
                        :size="16" class="
                            text-orange-600
                            dark:text-orange-400
                        "
                    />
                    <h3 class="text-sm font-semibold">
                        Weak Against
                    </h3>
                </div>
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
                    space-y-2
                "
            >
                <div class="flex items-center gap-2">
                    <Shield
                        :size="16" class="
                            text-blue-600
                            dark:text-blue-400
                        "
                    />
                    <h3 class="text-sm font-semibold">
                        Resistant To
                    </h3>
                </div>
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
                    space-y-2
                "
            >
                <div class="flex items-center gap-2">
                    <Ban
                        :size="16" class="
                            text-purple-600
                            dark:text-purple-400
                        "
                    />
                    <h3 class="text-sm font-semibold">
                        Immune To
                    </h3>
                </div>
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
                <div class="flex items-center gap-2">
                    <Minus :size="16" class="text-muted-foreground" />
                    <h3 class="text-sm font-semibold">
                        Normal Damage
                    </h3>
                </div>
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
