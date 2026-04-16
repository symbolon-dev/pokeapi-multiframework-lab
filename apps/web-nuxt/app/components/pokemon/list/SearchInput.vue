<script setup lang="ts">
import { X } from '@lucide/vue';

type Props = {
    modelValue: string;
};

type Emits = {
    (e: 'update:modelValue', value: string | number): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function clearSearch() {
    emit('update:modelValue', '');
}
</script>

<template>
    <Label for="search" class="relative">
        <Input
            :model-value="props.modelValue"
            placeholder="Search by name or ID..."
            class="pr-10"
            @update:model-value="$emit('update:modelValue', $event)"
        />
        <Button
            v-if="props.modelValue.length > 0"
            variant="ghost"
            size="icon"
            class="absolute top-1/2 right-1 size-7 -translate-y-1/2"
            @click="clearSearch"
        >
            <X :size="16" />
        </Button>
    </Label>
</template>
