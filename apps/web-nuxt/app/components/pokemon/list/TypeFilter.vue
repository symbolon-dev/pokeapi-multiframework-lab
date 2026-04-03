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
    <div class="mb-6">
        <div class="mb-3 flex flex-wrap gap-2">
            <Badge
                v-for="type in types"
                :key="type"
                :variant="selectedTypes.includes(type) ? 'default' : 'outline'"
                :disabled="!selectedTypes.includes(type) && selectedTypes.length >= 2"
                :class="[
                    !selectedTypes.includes(type) && selectedTypes.length >= 2
                        ? 'cursor-not-allowed opacity-40'
                        : 'cursor-pointer',
                ]"
                @click="toggleType(type)"
            >
                {{ type }}
            </Badge>
        </div>
        <p v-if="selectedTypes.length >= 2" class="text-sm text-gray-500">
            Max. 2 types selected
        </p>
    </div>
</template>
