<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

type Props = {
    data: PokemonDetail | undefined;
};

defineProps<Props>();
</script>

<template>
    <div>
        <p class="text-2xl font-bold capitalize">
            #{{ String(data?.id).padStart(3, '0') }} {{ data?.name }}
        </p>
        <p>
            Height: {{ data?.height ? `${(data.height / 10).toFixed(1)} m` : '—' }}
        </p>
        <p>
            Weight: {{ data?.weight ? `${(data.weight / 10).toFixed(1)} kg` : '—' }}
        </p>
        <p>
            Types:
            <span
                v-for="(type, index) in data?.types ?? []"
                :key="type"
                class="capitalize"
            >
                {{ type }}
                <span v-if="index < (data?.types.length ?? 0) - 1">| </span>
            </span>
        </p>
    </div>
</template>
