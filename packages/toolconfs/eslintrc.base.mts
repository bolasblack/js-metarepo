import { defineConfig } from 'eslint/config'

export default defineConfig({
  rules: {
    // off
    'max-classes-per-file': 'off',
    'no-shadow': 'off',
    // error
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        caughtErrors: 'none',
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    curly: ['error', 'multi-line'],
  },
})
