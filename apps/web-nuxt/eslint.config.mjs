// @ts-check
import antfu from '@antfu/eslint-config';
import tailwind from 'eslint-plugin-better-tailwindcss';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
    antfu(
        {
            vue: {
                a11y: true,
            },
            typescript: {
                tsconfigPath: './tsconfig.json',
                filesTypeAware: ['**/*.{ts,vue}'], // comment out if TS server/linting lags
            },
            stylistic: {
                indent: 4,
                quotes: 'single',
                semi: true,
            },
            formatters: true,
            ignores: ['*.config.ts', '*.config.mts'],
        },
        {
            name: 'project-strict',
            rules: {
                // Prefer type over interface for consistency
                '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

                // Warn when using `any`; allowed only for external data or edge cases
                '@typescript-eslint/no-explicit-any': 'warn',
            },
        },
        {
            name: 'tailwind-config',
            files: ['**/*.vue'],
            plugins: {
                'better-tailwindcss': tailwind,
            },
            settings: {
                'better-tailwindcss': {
                    entryPoint: 'app/assets/css/tailwind.css',
                },
            },
            rules: {
                ...tailwind.configs.stylistic.rules, // recommended has some issues with false positives, so using stylistic as a base
                'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', {
                    indent: 4,
                }],
            },
        },
    ),
);
