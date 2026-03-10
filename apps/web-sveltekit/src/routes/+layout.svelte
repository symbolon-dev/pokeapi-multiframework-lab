<script lang='ts'>
    import type { Snippet } from 'svelte';
    import favicon from '$lib/assets/favicon.svg?url';
    import './layout.css';

    const { children }: { children: Snippet } = $props();
</script>

<svelte:head><link rel='icon' href={favicon} /></svelte:head>
{@render children()}
