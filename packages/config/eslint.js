export const baseOptions = {
    typescript: true,
    stylistic: false,
    formatters: {
        css: 'prettier',
        html: 'prettier',
        markdown: 'prettier',
        typescript: 'prettier',
        javascript: 'prettier',
        json: 'prettier',
    },
    ignores: [
        '**/node_modules',
        '**/dist',
        '**/.next',
        '**/.nuxt',
        '**/.svelte-kit',
        '**/build',
        '**/.astro',
    ],
}
