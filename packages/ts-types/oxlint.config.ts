// oxlint-disable-next-line typescript/no-require-imports
const { defineConfig } = require('oxlint')
// oxlint-disable-next-line typescript/no-require-imports
const rootConfig = require('../../oxlint.config.ts')

module.exports = defineConfig({
  ...rootConfig,
  rules: {
    ...rootConfig.rules,
    'no-unused-vars': 'off',
  },
})
