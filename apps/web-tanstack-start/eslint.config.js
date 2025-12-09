import antfu from '@antfu/eslint-config'
import { tanstackConfig } from '@tanstack/eslint-config'
import { baseOptions } from '../../packages/config/eslint.js'

export default [...antfu(baseOptions, { react: true }), ...tanstackConfig]
