import antfu from '@antfu/eslint-config';

export default antfu({
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
});
