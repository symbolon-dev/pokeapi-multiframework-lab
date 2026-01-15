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
            // Prefer safe array callbacks
            'array-callback-return': ['error', { allowImplicit: false }],

            // Prefer arrow functions over function declarations
            'antfu/top-level-function': 'off',
            'prefer-arrow-callback': 'error',
            'func-style': ['error', 'expression'],

            // Prefer type over interface for consistency
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

            // Warn when using `any`; allowed only for external data or edge cases
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
);
