import antfu from '@antfu/eslint-config'
import { baseOptions } from '@repo/config/eslint'
import { tanstackConfig } from '@tanstack/eslint-config'

export default [...antfu(baseOptions, { react: true }), ...tanstackConfig]
