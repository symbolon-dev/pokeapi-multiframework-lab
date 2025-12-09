import antfu from '@antfu/eslint-config'
import nextPlugin from '@next/eslint-plugin-next'
import { baseOptions } from '@repo/config/eslint'

export default antfu(
    {
        ...baseOptions,
        react: true,
    },
    {
        plugins: {
            '@next/next': nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
        },
    },
    {
        ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    },
)
