// oxlint-disable-next-line typescript/no-require-imports
const { defineConfig } = require('oxfmt')

module.exports = defineConfig({
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  arrowParens: 'avoid',
  ignorePatterns: [
    '**/node_modules/**',
    '**/__snapshots__/**',
    '**/dist/**',
    '**/lib/**',
    '**/coverage/**',
    '**/dtslint/**',
    '**/.typedoc/**',
  ],
})
