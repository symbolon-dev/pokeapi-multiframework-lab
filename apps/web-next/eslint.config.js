import antfu from '@antfu/eslint-config'
import nextConfig from 'eslint-config-next'
import { baseOptions } from '../../packages/config/eslint.js'

export default [...antfu(baseOptions, { react: true }), ...nextConfig]
