<script setup lang="ts">
import type { EvolutionNode, EvolutionRequirement, PokemonDetail } from '@repo/types';
import { ArrowRight } from '@lucide/vue';

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

function formatRequirement(req: EvolutionRequirement | undefined): string[] {
    if (!req)
        return [];

    const parts: string[] = [];

    if (req.item) {
        parts.push(`Use ${req.item.name.replace(/-/g, ' ')}`);
    }

    if (req.minLevel != null) {
        parts.push(`Level ${req.minLevel}`);
    }

    if (req.location) {
        parts.push(`At ${req.location.name.replace(/-/g, ' ')}`);
    }

    if (req.minHappiness != null) {
        parts.push(`Happiness ${req.minHappiness}+`);
    }

    if (req.minAffection != null) {
        parts.push(`Affection ${req.minAffection}+`);
    }

    if (req.timeOfDay != null) {
        parts.push(`During ${req.timeOfDay}`);
    }

    if (req.knownMoveType) {
        parts.push(`Knows ${req.knownMoveType.name}-type move`);
    }

    if (req.minBeauty != null) {
        parts.push(`Beauty ${req.minBeauty}+`);
    }

    if (req.heldItem) {
        parts.push(`Hold ${req.heldItem.name.replace(/-/g, ' ')}`);
    }

    if (req.knownMove) {
        parts.push(`Knows ${req.knownMove.name.replace(/-/g, ' ')}`);
    }

    if (req.tradeSpecies) {
        parts.push(`Trade for ${req.tradeSpecies.name}`);
    }

    if (req.needsOverworldRain) {
        parts.push('During rain');
    }

    if (req.turnUpsideDown) {
        parts.push('Turn device upside down');
    }

    return parts;
}

const flatEvolutions = computed<FlatEvo[]>(() => {
    if (props.data?.evolutions == null)
        return [];
    return flattenTree(props.data.evolutions);
});

const hasEvolutions = computed(() => {
    return flatEvolutions.value.length > 1;
});
</script>

<template>
    <div v-if="hasEvolutions">
        <div class="rounded-xl border bg-card p-6 shadow-sm">
            <h2 class="mb-4 text-xl font-bold">
                Evolutions
            </h2>

            <div class="space-y-1">
                <template
                    v-for="(evo, index) in flatEvolutions"
                    :key="`${evo.node.id}-${evo.level}`"
                >
                    <div class="flex items-center gap-2">
                        <div
                            v-for="l in evo.level"
                            :key="l"
                            class="w-8 shrink-0"
                        />
                        <NuxtLink
                            :to="`/details/${evo.node.id}`"
                            class="
                                flex flex-1 items-center gap-3 rounded-lg p-3
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
                                <div
                                    v-if="evo.node.requirement"
                                    class="mt-1 flex flex-wrap gap-1"
                                >
                                    <span
                                        v-for="(part, idx) in formatRequirement(evo.node.requirement)"
                                        :key="idx"
                                        class="
                                            rounded-sm bg-primary/10 px-1.5
                                            py-0.5 text-xs font-medium
                                            text-primary
                                        "
                                    >
                                        {{ part }}
                                    </span>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>

                    <div
                        v-if="index < flatEvolutions.length - 1 && (flatEvolutions[index + 1]?.level ?? -1) > evo.level"
                        class="flex items-center gap-2 py-2"
                    >
                        <div
                            v-for="l in evo.level"
                            :key="l"
                            class="w-8 shrink-0"
                        />
                        <div
                            class="
                                flex items-center gap-2 pl-8
                                text-muted-foreground
                            "
                        >
                            <ArrowRight :size="20" />
                            <span class="text-xs font-medium">Evolves to</span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
