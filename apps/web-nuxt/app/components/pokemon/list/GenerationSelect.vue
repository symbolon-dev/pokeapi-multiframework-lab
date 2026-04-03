<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';

type Props = {
    modelValue: string | number;
    generations?: number[];
};

type Emits = {
    (e: 'update:modelValue', value: AcceptableValue): void;
};

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
    <Label for="generation">
        <Select
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
        >
            <SelectTrigger>
                <SelectValue placeholder="All Generations" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">
                    All Generations
                </SelectItem>
                <SelectItem
                    v-for="gen in generations"
                    :key="gen"
                    :value="gen"
                >
                    Gen {{ gen }}
                </SelectItem>
            </SelectContent>
        </Select>
    </Label>
</template>
