import antfu from '@antfu/eslint-config';

export default antfu(
    {
        type: 'lib',
        typescript: {
            tsconfigPath: './tsconfig.json',
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
            // Prefer type over interface for consistency
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

            // Warn when using `any`; allowed only for external data or edge cases
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
);
