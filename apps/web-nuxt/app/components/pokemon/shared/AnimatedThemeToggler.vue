<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue';

type Props = {
    duration?: number;
};

const props = withDefaults(defineProps<Props>(), {
    duration: 400,
});

const colorMode = useColorMode();

const isAnimating = ref(false);

const isDark = computed(() => colorMode.value === 'dark');

async function toggle(e: MouseEvent) {
    if (isAnimating.value)
        return;

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
    );

    const currentlyDark = colorMode.value === 'dark';
    const next = currentlyDark ? 'light' : 'dark';

    if (!('startViewTransition' in document)) {
        colorMode.preference = next;
        return;
    }

    isAnimating.value = true;

    const transition = document.startViewTransition(() => {
        colorMode.preference = next;
    });

    await transition.ready;

    document.documentElement.animate(
        {
            clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
        },
        {
            duration: props.duration,
            easing: 'ease-out',
            pseudoElement: '::view-transition-new(root)',
        },
    );

    await transition.finished;
    isAnimating.value = false;
}
</script>

<template>
    <button
        class="
            relative flex cursor-pointer items-center justify-center
            rounded-full p-2 transition-colors
        "
        :class="isAnimating ? 'cursor-not-allowed opacity-50' : 'hover:bg-muted'"
        :disabled="isAnimating"
        aria-label="Toggle theme"
        @click="toggle"
    >
        <ClientOnly>
            <Sun v-if="isDark" class="size-5" />
            <Moon v-else class="size-5" />
        </ClientOnly>
    </button>
</template>
