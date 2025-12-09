import antfu from '@antfu/eslint-config'
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import { baseOptions } from '@repo/config/eslint'

export default createConfigForNuxt().prepend(
    ...antfu(baseOptions, { vue: true }),
)
