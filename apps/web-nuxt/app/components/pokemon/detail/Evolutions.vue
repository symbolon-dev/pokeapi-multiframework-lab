<script setup lang="ts">
import type { EvolutionNode, PokemonDetail } from '~/types/pokemon';

type Props = {
    data: PokemonDetail | undefined;
};

const props = defineProps<Props>();

type FlatEvo = { node: EvolutionNode; level: number; isLast: boolean; parentIsLast: boolean[] };

function flattenTree(node: EvolutionNode, level = 0, parentIsLast: boolean[] = []): FlatEvo[] {
    const result: FlatEvo[] = [{ node, level, isLast: true, parentIsLast: [...parentIsLast] }];
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const isLast = i === node.children.length - 1;
        result.push(...flattenTree(child as EvolutionNode, level + 1, [...parentIsLast, isLast]));
    }
    return result;
}

const flatEvolutions = computed<FlatEvo[]>(() => {
    if (!props.data?.evolutions)
        return [];
    return flattenTree(props.data.evolutions);
});
</script>

<template>
    <div v-if="data?.evolutions" class="mt-6">
        <h2 class="mb-3 text-xl font-semibold">
            Evolutions
        </h2>

        <div class="rounded-lg border p-4">
            <div class="flex flex-col gap-0">
                <div
                    v-for="(evo, idx) in flatEvolutions"
                    :key="`${evo.node.id}-${evo.level}`"
                    class="relative flex items-center"
                    :class="idx < flatEvolutions.length - 1 ? 'min-h-20' : `
                        min-h-20
                    `"
                >
                    <template v-for="(isLast, l) in evo.parentIsLast" :key="l">
                        <div
                            v-if="!isLast"
                            class="absolute h-full border-l border-border"
                            :style="{ left: `${l * 24 + 10}px` }"
                        />
                    </template>

                    <div
                        v-if="evo.level > 0"
                        class="absolute border-t border-border"
                        :style="{
                            left: `${(evo.level - 1) * 24 + 10}px`,
                            width: '14px',
                            top: '50%',
                        }"
                    />

                    <div
                        class="
                            flex flex-col items-center rounded-lg p-2
                            transition-colors
                        "
                        :class="evo.node.id === data?.id
                            ? 'bg-primary/10 ring-2 ring-primary'
                            : `
                                bg-secondary/50
                                hover:bg-secondary
                            `
                        "
                        :style="{ marginLeft: `${evo.level * 24}px` }"
                    >
                        <NuxtLink :to="`/details/${evo.node.id}`">
                            <NuxtImg
                                :src="evo.node.sprite"
                                :alt="evo.node.name"
                                width="64"
                                height="64"
                                class="mb-1"
                            />
                        </NuxtLink>
                        <NuxtLink
                            :to="`/details/${evo.node.id}`"
                            class="
                                text-sm font-medium capitalize
                                hover:underline
                            "
                        >
                            #{{ String(evo.node.id).padStart(3, '0') }} {{ evo.node.name }}
                        </NuxtLink>
                        <span
                            v-if="evo.node.minLevel"
                            class="text-xs text-muted-foreground"
                        >
                            Lv. {{ evo.node.minLevel }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
