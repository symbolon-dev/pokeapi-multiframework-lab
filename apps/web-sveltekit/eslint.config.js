import antfu from '@antfu/eslint-config'
import { baseOptions } from '@repo/config/eslint'

export default antfu({
    ...baseOptions,
    svelte: true,
})
