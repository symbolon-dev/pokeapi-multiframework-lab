import antfu from '@antfu/eslint-config';
import tailwind from 'eslint-plugin-better-tailwindcss';

export default antfu(
    {
        svelte: true,
        typescript: {
            tsconfigPath: './tsconfig.json',
            // filesTypeAware: ['**/*.{ts,svelte}'],
        },
        stylistic: {
            indent: 4,
            quotes: 'single',
            semi: true,
        },
        formatters: true,
    },
    {
        name: 'project-strict',
        rules: {
            // Prefer safe array callbacks
            // 'array-callback-return': ['error', { allowImplicit: false }],

            // Prefer arrow functions over function declarations
            // 'antfu/top-level-function': 'off',
            // 'prefer-arrow-callback': 'error',
            // 'func-style': ['error', 'expression'],

            // Prefer type over interface for consistency
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

            // Warn when using `any`; allowed only for external data or edge cases
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        name: 'dts-files',
        files: ['**/*.d.ts'],
        rules: {
            '@typescript-eslint/consistent-type-definitions': 'off',
        },
    },
    {
        name: 'svelte-specific',
        files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
        rules: {
            'antfu/no-top-level-await': 'off',
        },
    },
    {
        name: 'tailwind-config',
        files: ['**/*.svelte'],
        plugins: {
            'better-tailwindcss': tailwind,
        },
        rules: {
            ...tailwind.configs.stylistic.rules,
            'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', {
                indent: 4,
            }],
        },
    },
);
