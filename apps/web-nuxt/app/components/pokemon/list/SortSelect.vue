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
            <SelectTrigger class="w-40">
                <SelectValue placeholder="ID (Ascending)" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="id-asc">
                    ID (Ascending)
                </SelectItem>
                <SelectItem value="id-desc">
                    ID (Descending)
                </SelectItem>
                <SelectItem value="name-asc">
                    Name (A → Z)
                </SelectItem>
                <SelectItem value="name-desc">
                    Name (Z → A)
                </SelectItem>
            </SelectContent>
        </Select>
    </Label>
</template>
