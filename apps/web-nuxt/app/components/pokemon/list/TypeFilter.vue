<script setup lang="ts">
type Props = {
    types?: string[];
    selectedTypes: string[];
};

type Emits = {
    (e: 'update:selectedTypes', types: string[]): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const typeColors: Record<string, string> = {
    normal: '#9FA19F',
    fire: '#E62829',
    fighting: '#FF8000',
    water: '#2980EF',
    flying: '#81B9EF',
    grass: '#3FA129',
    poison: '#9141CB',
    electric: '#FAC000',
    ground: '#915121',
    psychic: '#EF4179',
    rock: '#AFA981',
    ice: '#3DCEF3',
    bug: '#91A119',
    dragon: '#5060E1',
    ghost: '#704170',
    dark: '#624D4E',
    steel: '#60A1B8',
    fairy: '#EF70EF',
};

const typeIcons = Object.fromEntries(
    (props.types ?? []).map(type => [
        type,
        defineAsyncComponent(async () => import(`@/assets/icons/${type}.svg?component`) as Promise<Component>),
    ]),
);

function toggleType(type: string) {
    const idx = props.selectedTypes.indexOf(type);
    if (idx !== -1) {
        const newTypes = [...props.selectedTypes];
        newTypes.splice(idx, 1);
        emit('update:selectedTypes', newTypes);
    }
    else if (props.selectedTypes.length < 2) {
        emit('update:selectedTypes', [...props.selectedTypes, type]);
    }
}
</script>

<template>
    <div>
        <div class="flex flex-wrap gap-2">
            <Badge
                v-for="type in types"
                :key="type"
                :variant="selectedTypes.includes(type) ? 'outline-border' : 'outline'"
                :disabled="!selectedTypes.includes(type) && selectedTypes.length >= 2"
                class="h-10 w-fit px-2 text-sm"
                :class="[
                    !selectedTypes.includes(type) && selectedTypes.length >= 2
                        ? 'cursor-not-allowed opacity-40'
                        : 'cursor-pointer',
                ]"
                @click="toggleType(type)"
            >
                <span
                    class="
                        size-5
                        [&>svg]:block [&>svg]:size-full
                    "
                >
                    <ClientOnly>
                        <component :is="typeIcons[type]" :style="{ color: typeColors[type] }" />
                    </ClientOnly>
                </span>
                <span class="px-0.5">
                    {{ type }}
                </span>
            </Badge>
        </div>
        <p v-if="selectedTypes.length >= 2" class="text-sm text-gray-500">
            Max. 2 types selected
        </p>
    </div>
</template>
