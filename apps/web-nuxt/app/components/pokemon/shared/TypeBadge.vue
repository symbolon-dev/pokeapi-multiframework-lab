<script lang="ts">
export const TYPE_COLORS: Record<string, string> = {
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
</script>

<script setup lang="ts">
type Props = {
    type: string;
};

const props = defineProps<Props>();

const getTypeColor = (type: string) => TYPE_COLORS[type.toLowerCase()] ?? '#777';

const typeIcon = computed(() =>
    defineAsyncComponent(async () => import(`@/assets/icons/${props.type}.svg?component`) as Promise<Component>),
);
</script>

<template>
    <Badge
        variant="outline"
        class="h-8 w-fit gap-1.5 px-2.5 text-sm capitalize"
    >
        <span
            class="
                size-4
                [&>svg]:block [&>svg]:size-full
            "
        >
            <component :is="typeIcon" :style="{ color: getTypeColor(type) }" />
        </span>
        <span>
            {{ type }}
        </span>
    </Badge>
</template>
