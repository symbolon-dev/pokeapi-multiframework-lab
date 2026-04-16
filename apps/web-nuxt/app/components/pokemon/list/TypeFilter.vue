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
            <Button
                v-for="type in types"
                :key="type"
                variant="ghost"
                :disabled="!selectedTypes.includes(type) && selectedTypes.length >= 2"
                class="h-auto rounded-full p-0"
                :class="[
                    !selectedTypes.includes(type) && selectedTypes.length >= 2
                        ? 'cursor-not-allowed opacity-40'
                        : 'cursor-pointer',
                    selectedTypes.includes(type) ? `
                        ring-2 ring-gray-400
                        dark:ring-gray-500
                    ` : '',
                ]"
                @click="toggleType(type)"
            >
                <PokemonSharedTypeBadge :type="type" />
            </Button>
        </div>
        <p v-if="selectedTypes.length >= 2" class="text-sm text-gray-500">
            Max. 2 types selected
        </p>
    </div>
</template>
