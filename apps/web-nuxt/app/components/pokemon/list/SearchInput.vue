<script setup lang="ts">
type Props = {
    modelValue: string;
};

type Emits = {
    (e: 'update:modelValue', value: string | number): void;
};

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
    <Label for="search">
        <Input
            :model-value="modelValue"
            placeholder="Search by name or ID..."
            @update:model-value="$emit('update:modelValue', $event)"
        />
    </Label>
</template>
