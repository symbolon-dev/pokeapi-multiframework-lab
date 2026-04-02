<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue';

const props = withDefaults(defineProps<{
    duration?: number;
}>(), {
    duration: 400,
});

const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === 'dark');

async function toggle(e: MouseEvent) {
    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
    );

    const next = isDark.value ? 'light' : 'dark';

    if (!('startViewTransition' in document)) {
        colorMode.value = next;
        return;
    }

    const transition = document.startViewTransition(() => {
        colorMode.value = next;
    });

    await transition.ready;

    const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
        { clipPath: isDark.value ? [...clipPath].reverse() : clipPath },
        {
            duration: props.duration,
            easing: 'ease-in',
            pseudoElement: isDark.value
                ? '::view-transition-old(root)'
                : '::view-transition-new(root)',
        },
    );
}
</script>

<template>
    <button
        class="
            relative flex items-center justify-center rounded-full p-2
            transition-colors
            hover:bg-muted
        "
        aria-label="Toggle theme"
        @click="toggle"
    >
        <Sun v-if="isDark" class="size-5" />
        <Moon v-else class="size-5" />
    </button>
</template>
