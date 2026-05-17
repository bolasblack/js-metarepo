import { defineConfig } from 'oxlint'

// LLM: copy this template to oxlint.config.ts, or extract JSON-equivalent sections.
// LLM: keep baseConfig; add typescriptConfig for TypeScript projects.
// LLM: add reactConfig only for React projects.
// LLM: add oxfmtStyleConfig when Oxfmt owns formatting/style.

export const baseConfig = defineConfig({
  categories: {
    correctness: 'off',
  },
  ignorePatterns: [
    '**/node_modules/**',
    '**/__snapshots__/**',
    '**/dist/**',
    '**/lib/**',
    '**/coverage/**',
    '**/dtslint/**',
    '**/.typedoc/**',
  ],
  rules: {
    'max-classes-per-file': 'off',
    'no-shadow': 'off',
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

export const typescriptConfig = defineConfig({
  plugins: ['typescript'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
      rules: {
        'no-array-constructor': 'error',
        'no-unused-expressions': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'typescript/ban-ts-comment': 'error',
        'typescript/consistent-type-assertions': 'off',
        'typescript/consistent-type-definitions': 'off',
        'typescript/explicit-function-return-type': ['error', { allowExpressions: true }],
        'typescript/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
        'typescript/no-duplicate-enum-values': 'error',
        'typescript/no-empty-interface': 'off',
        'typescript/no-empty-object-type': 'error',
        'typescript/no-explicit-any': 'off',
        'typescript/no-extra-non-null-assertion': 'error',
        'typescript/no-floating-promises': ['error', { ignoreVoid: true }],
        'typescript/no-misused-new': 'error',
        'typescript/no-namespace': 'off',
        'typescript/no-non-null-assertion': 'off',
        'typescript/no-non-null-asserted-optional-chain': 'error',
        'typescript/no-require-imports': 'error',
        'typescript/no-this-alias': 'error',
        'typescript/no-unnecessary-type-constraint': 'error',
        'typescript/no-unsafe-declaration-merging': 'error',
        'typescript/no-unsafe-function-type': 'error',
        'typescript/no-use-before-define': 'off',
        'typescript/no-wrapper-object-types': 'error',
        'typescript/parameter-properties': 'off',
        'typescript/prefer-as-const': 'error',
        'typescript/prefer-namespace-keyword': 'error',
        'typescript/triple-slash-reference': 'error',
      },
    },
  ],
})

export const reactConfig = defineConfig({
  plugins: ['react'],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'react/rules-of-hooks': 'error',
    'react/exhaustive-deps': 'error',
  },
})

export const oxfmtStyleConfig = defineConfig({
  categories: {
    style: 'off',
  },
})

export default defineConfig({
  extends: [baseConfig, typescriptConfig, reactConfig, oxfmtStyleConfig],
})
