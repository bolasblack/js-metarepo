import { defineConfig } from 'eslint/config'
import defaultConfig from '../../eslint.config.mjs'

export default defineConfig(defaultConfig, {
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
  },
})
