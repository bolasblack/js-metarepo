const path = require('path')

module.exports = {
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
  },
}
