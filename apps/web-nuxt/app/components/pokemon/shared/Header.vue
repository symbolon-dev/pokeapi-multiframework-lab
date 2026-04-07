<script setup lang="ts">
import AnimatedThemeToggler from './AnimatedThemeToggler.vue';
</script>

<template>
    <header class="flex items-center justify-between py-4">
        <NuxtLink to="/" class="text-lg font-semibold">
            PokéDex
        </NuxtLink>

        <div class="min-h-9">
            <AnimatedThemeToggler />
        </div>
    </header>
</template>
