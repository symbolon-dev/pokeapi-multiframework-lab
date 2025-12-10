import antfu from '@antfu/eslint-config'
import { baseOptions } from '@repo/config/eslint'
import { withNuxt } from './.nuxt/eslint.config.mjs'

export default withNuxt(
    antfu({
        ...baseOptions,
        vue: true,
    }),
)
