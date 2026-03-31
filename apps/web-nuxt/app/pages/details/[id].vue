<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

const router = useRouter();

const route = useRoute();
const id = route.params.id as string;

const isShiny = ref(false);

const { data } = await useAsyncData(`pokemon-detail-${id}`, async () => {
    return $fetch<PokemonDetail>(`/api/pokemon/${id}`);
});
</script>

<template>
    <div class="p-4">
        <button @click="router.push('/')">
            Back
        </button>

        <div>
            <NuxtImg
                v-if="data?.sprites.default"
                :src="data.sprites.default"
                class="my-4 rounded-lg" :class="[isShiny ? 'hidden' : 'block']"
                :style="{ backgroundColor: data.sprites.dominantColor ?? undefined }"
                alt="Pokemon Image"
                width="200"
                height="200"
            />
            <NuxtImg
                v-if="data?.sprites.defaultShiny"
                :src="data.sprites.defaultShiny"
                class="my-4 rounded-lg" :class="[isShiny ? 'block' : 'hidden']"
                :style="{ backgroundColor: data.sprites.dominantColor ?? undefined }"
                alt="Pokemon Image"
                width="200"
                height="200"
            />
            <div class="flex items-center gap-2">
                <Label for="switchId" aria-label="Shiny Toggle">
                    Shiny Toggle
                    <Switch id="switchId" v-model="isShiny" aria-label="Shiny Toggle" />
                </Label>
            </div>
        </div>

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

        <div v-if="data?.evolutions?.length" class="mt-6">
            <h2 class="mb-2 text-xl font-semibold">
                Evolutions
            </h2>

            <div class="flex items-center gap-4">
                <template v-for="(evo, index) in data.evolutions" :key="JSON.stringify(evo)">
                    <NuxtLink
                        :to="`/details/${evo.id}`"
                        class="flex flex-col items-center"
                    >
                        <NuxtImg
                            :src="evo.sprite"
                            width="80"
                            height="80"
                            class="mb-1"
                        />
                        <span class="text-sm capitalize">
                            #{{ String(evo?.id).padStart(3, '0') }} {{ evo.name }}</span>
                        <span
                            v-if="evo.minLevel" class="
                                text-xs text-muted-foreground
                            "
                        >Lv. {{ evo.minLevel }}</span>
                    </NuxtLink>

                    <span v-if="index < data.evolutions.length - 1">
                        →
                    </span>
                </template>
            </div>
        </div>

        <div v-if="data?.typeEffectiveness" class="mt-6">
            <h2 class="mb-4 text-xl font-semibold">
                Type Effectiveness
            </h2>

            <div class="grid grid-cols-2 gap-4">
                <!-- Weak -->
                <div class="rounded-lg border p-3">
                    <p class="mb-2 text-sm font-medium text-red-500">
                        Weak (2×)
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <span
                            v-for="item in data.typeEffectiveness.weak"
                            :key="item.type"
                            class="
                                rounded bg-red-500/20 px-2 py-1 text-xs
                                text-red-600 capitalize
                            "
                        >
                            {{ item.type }} ({{ item.multiplier }}×)
                        </span>
                    </div>
                </div>

                <!-- Resistant -->
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

                <!-- Immune -->
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

                <!-- Normal -->
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
    </div>
</template>
