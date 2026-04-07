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
            <SelectTrigger class="w-28">
                <SelectValue placeholder="All Gens" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">
                    All Gens
                </SelectItem>
                <SelectItem
                    v-for="gen in generations"
                    :key="gen"
                    :value="gen"
                >
                    {{ gen }}. Gen
                </SelectItem>
            </SelectContent>
        </Select>
    </Label>
</template>
