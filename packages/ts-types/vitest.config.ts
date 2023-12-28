import { mergeConfig } from 'vitest/config'
import defaultConfig from '../../vitest.config'

export default mergeConfig(defaultConfig, {
  test: {
    typecheck: {
      ignoreSourceErrors: true,
      include: ['**/*.spec.ts'],
    },
  },
})
