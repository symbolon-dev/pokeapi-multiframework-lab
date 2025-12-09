import antfu from '@antfu/eslint-config'
import { baseOptions } from '@repo/config/eslint'
import nextConfig from 'eslint-config-next'

export default [...antfu(baseOptions, { react: true }), ...nextConfig]
