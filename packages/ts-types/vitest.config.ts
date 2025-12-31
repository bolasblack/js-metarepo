import { mergeConfig } from 'vitest/config'
import defaultConfig from '../../vitest.config'

export default mergeConfig(defaultConfig, {
  test: {
    typecheck: {
      // Disable Vitest's typecheck to avoid "Unhandled Typecheck Error" in CI/Lerna environments.
      // We use explicit `tsc --noEmit` in package.json test script instead.
      enabled: process.env.LERNA_TEST ? false : true,
      ignoreSourceErrors: true,
      include: ['**/*.spec.ts'],
    },
  },
})
