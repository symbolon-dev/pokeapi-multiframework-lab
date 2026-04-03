<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

type Props = {
    data: PokemonDetail | undefined;
};

defineProps<Props>();
</script>

<template>
    <div class="grid grid-cols-3 gap-2.5">
        <div
            v-for="[key, val] in Object.entries(data?.stats ?? {})"
            :key="key"
            class="rounded-md bg-secondary px-3.5 py-3"
        >
            <div class="mb-1 text-xs text-muted-foreground capitalize">
                {{ key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }}
            </div>
            <div class="text-2xl font-medium">
                {{ val }}
            </div>
        </div>
    </div>
</template>
