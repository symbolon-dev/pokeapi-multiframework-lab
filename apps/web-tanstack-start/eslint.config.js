import antfu from '@antfu/eslint-config'
import { baseOptions } from '@repo/config/eslint'
import tanstackQuery from '@tanstack/eslint-plugin-query'

export default antfu(
    {
        ...baseOptions,
        react: true,
    },
    {
        plugins: {
            '@tanstack/query': tanstackQuery,
        },
        rules: tanstackQuery.configs.recommended.rules,
    },
)
