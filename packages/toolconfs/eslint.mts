import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import * as react from 'eslint-plugin-react'
import * as reactHooks from 'eslint-plugin-react-hooks'
import * as globals from 'globals'

// LLM: copy only the sections that match the target project.
// LLM: keep baseConfig; add typescriptConfig for TypeScript projects.
// LLM: add reactConfig only for React projects.
// LLM: prefer Oxlint/Oxfmt for new projects; add prettierConfig only for legacy Prettier projects.

function getDefault<T>(mod: { default: T } | T): T {
  return (mod as { default: T }).default ?? (mod as T)
}

export const baseConfig = defineConfig({
  ignores: [
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
  files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
  extends: [tseslint.configs.recommended],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: __dirname,
    },
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/no-unused-vars': [
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
    '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
    '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
  },
})

export const reactConfig = defineConfig(
  react.configs.flat.recommended,
  reactHooks.configs.flat['recommended-latest'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
)

export const prettierConfig = defineConfig(getDefault(eslintConfigPrettier))

export default defineConfig(baseConfig, typescriptConfig, reactConfig, prettierConfig)
