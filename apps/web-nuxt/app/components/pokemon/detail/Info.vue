<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';
import { Ruler, Weight } from '@lucide/vue';

type Props = {
    data: PokemonDetail | undefined;
};

defineProps<Props>();
</script>

<template>
    <div v-if="data" class="flex flex-col gap-6">
        <div class="rounded-xl border bg-card p-6 shadow-sm">
            <div class="mb-4 flex items-baseline gap-3">
                <h1 class="text-4xl font-bold capitalize">
                    {{ data.name }}
                </h1>
                <span class="text-xl font-semibold text-muted-foreground">
                    #{{ String(data.id).padStart(4, '0') }}
                </span>
            </div>

            <div class="mb-4 flex flex-wrap gap-2">
                <PokemonSharedTypeBadge
                    v-for="type in data.types"
                    :key="type"
                    :type="type"
                />
            </div>

            <div
                class="
                    grid gap-4
                    sm:grid-cols-2
                "
            >
                <div
                    class="
                        flex items-center gap-3 rounded-lg bg-secondary/50 p-4
                    "
                >
                    <div
                        class="
                            flex size-10 items-center justify-center
                            rounded-full bg-primary/10
                        "
                    >
                        <Ruler :size="20" />
                    </div>
                    <div>
                        <p class="text-xs font-medium text-muted-foreground">
                            Height
                        </p>
                        <p class="text-lg font-semibold">
                            {{ data.height ? `${(data.height / 10).toFixed(1)} m` : '—' }}
                        </p>
                    </div>
                </div>

                <div
                    class="
                        flex items-center gap-3 rounded-lg bg-secondary/50 p-4
                    "
                >
                    <div
                        class="
                            flex size-10 items-center justify-center
                            rounded-full bg-primary/10
                        "
                    >
                        <Weight :size="20" />
                    </div>
                    <div>
                        <p class="text-xs font-medium text-muted-foreground">
                            Weight
                        </p>
                        <p class="text-lg font-semibold">
                            {{ data.weight ? `${(data.weight / 10).toFixed(1)} kg` : '—' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
