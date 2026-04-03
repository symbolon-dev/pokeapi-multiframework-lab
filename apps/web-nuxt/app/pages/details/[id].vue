<script setup lang="ts">
import type { PokemonDetail } from '~/types/pokemon';

const router = useRouter();

const route = useRoute();
const id = route.params.id as string;

const isShiny = ref(false);

const { data, pending, error, refresh } = await useAsyncData(`pokemon-detail-${id}`, async () => {
    return $fetch<PokemonDetail>(`/api/pokemon/${id}`);
});

const isNotFound = computed(() => error.value?.statusCode === 404);
const isServerError = computed(() => error.value && error.value.statusCode && error.value.statusCode >= 500);

async function retry() {
    await refresh();
}
</script>

<template>
    <div class="p-4">
        <Button @click="router.push('/')">
            Back
        </Button>

        <div v-if="pending" class="mt-8 flex flex-col items-center gap-4">
            <div
                class="
                    h-48 w-48 animate-pulse rounded-lg bg-gray-200
                    dark:bg-gray-700
                "
            />
            <div
                class="
                    h-6 w-32 animate-pulse rounded bg-gray-200
                    dark:bg-gray-700
                "
            />
            <div
                class="
                    h-4 w-48 animate-pulse rounded bg-gray-200
                    dark:bg-gray-700
                "
            />
            <p
                class="
                    text-sm text-gray-500
                    dark:text-gray-400
                "
            >
                Loading Pokémon details...
            </p>
        </div>

        <div v-else-if="isNotFound" class="mt-8 text-center">
            <p
                class="
                    mb-2 text-2xl font-bold text-gray-700
                    dark:text-gray-300
                "
            >
                Pokémon Not Found
            </p>
            <p
                class="
                    mb-4 text-sm text-gray-500
                    dark:text-gray-400
                "
            >
                The Pokémon with ID {{ id }} does not exist.
            </p>
            <Button @click="router.push('/')">
                Back to List
            </Button>
        </div>

        <div v-else-if="isServerError" class="mt-8 text-center">
            <p
                class="
                    mb-2 text-xl font-semibold text-red-600
                    dark:text-red-400
                "
            >
                Server Error
            </p>
            <p
                class="
                    mb-4 text-sm text-gray-500
                    dark:text-gray-400
                "
            >
                {{ error?.statusMessage || 'An unexpected error occurred' }}
            </p>
            <Button @click="retry">
                Try Again
            </Button>
        </div>

        <div v-else-if="error" class="mt-8 text-center">
            <p
                class="
                    mb-2 text-xl font-semibold text-red-600
                    dark:text-red-400
                "
            >
                Failed to Load
            </p>
            <p
                class="
                    mb-4 text-sm text-gray-500
                    dark:text-gray-400
                "
            >
                {{ error?.message || 'An unexpected error occurred' }}
            </p>
            <Button @click="retry">
                Try Again
            </Button>
        </div>

        <template v-else-if="data">
            <PokemonDetailImage
                v-model:is-shiny="isShiny"
                :data="data"
            />

            <PokemonDetailInfo :data="data" />

            <PokemonDetailStats :data="data" />

            <PokemonDetailEvolutions :data="data" />

            <PokemonDetailTypeEffectiveness :data="data" />
        </template>
    </div>
</template>
