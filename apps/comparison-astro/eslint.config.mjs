import antfu from '@antfu/eslint-config';
// import pluginAstro from 'eslint-plugin-astro';
import tailwind from 'eslint-plugin-better-tailwindcss';

export default antfu(
    {
        astro: true,
        typescript: {
            tsconfigPath: './tsconfig.json',
            filesTypeAware: ['**/*.{ts,astro}'], // comment out if TS server/linting lags
        },
        stylistic: {
            indent: 4,
            quotes: 'single',
            semi: true,
        },
        formatters: true,
    },
    // JSX-a11y: Only needed for React islands
    // ...pluginAstro.configs['jsx-a11y-recommended'],
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
        files: ['**/*.astro'],
        plugins: {
            'better-tailwindcss': tailwind,
        },
        rules: {
            ...tailwind.configs.stylistic.rules, // recommended has some issues with false positives, so using stylistic as a base
            'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', {
                indent: 4,
            }],
        },
    },
);
