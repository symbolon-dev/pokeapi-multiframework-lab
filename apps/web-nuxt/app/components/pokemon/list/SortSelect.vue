<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';
import type { SortOrder } from '~/types/pokemon';

type Props = {
    modelValue: SortOrder;
};

type Emits = {
    (e: 'update:modelValue', value: AcceptableValue): void;
};

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
    <Label for="sort">
        <Select
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
        >
            <SelectTrigger>
                <SelectValue placeholder="ID ↑" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="id-asc">
                    ID ↑
                </SelectItem>
                <SelectItem value="id-desc">
                    ID ↓
                </SelectItem>
                <SelectItem value="name-asc">
                    Name ↑
                </SelectItem>
                <SelectItem value="name-desc">
                    Name ↓
                </SelectItem>
            </SelectContent>
        </Select>
    </Label>
</template>
