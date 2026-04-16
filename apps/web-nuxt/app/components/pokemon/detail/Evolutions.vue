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
    <div v-if="data?.evolutions">
        <div class="rounded-xl border bg-card p-6 shadow-sm">
            <h2 class="mb-4 text-xl font-bold">
                Evolutions
            </h2>

            <div class="space-y-2">
                <div
                    v-for="evo in flatEvolutions"
                    :key="`${evo.node.id}-${evo.level}`"
                    class="flex items-center gap-2"
                >
                    <div
                        v-for="l in evo.level"
                        :key="l"
                        class="w-8 shrink-0"
                    />
                    <NuxtLink
                        :to="`/details/${evo.node.id}`"
                        class="
                            flex items-center gap-3 rounded-lg p-3
                            transition-all
                        "
                        :class="evo.node.id === data?.id
                            ? 'bg-primary/10 ring-2 ring-primary'
                            : `
                                bg-secondary/50
                                hover:bg-secondary
                            `
                        "
                    >
                        <NuxtImg
                            :src="evo.node.sprite"
                            :alt="evo.node.name"
                            width="64"
                            height="64"
                            class="size-16"
                        />
                        <div class="flex flex-col">
                            <span class="text-sm font-bold capitalize">
                                {{ evo.node.name }}
                            </span>
                            <span class="text-xs text-muted-foreground">
                                #{{ String(evo.node.id).padStart(3, '0') }}
                            </span>
                            <span
                                v-if="evo.node.minLevel"
                                class="text-xs font-medium text-primary"
                            >
                                Lv. {{ evo.node.minLevel }}
                            </span>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
