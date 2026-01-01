// Merged from @c4605/toolconfs v5.3.1 (llms.md)
// - eslintrc.base.mts
// - eslintrc.ts.mts
// - eslintrc.prettier.mts

import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

// Helper to extract default export from namespace imports
// This handles CommonJS modules where `import * as` creates { default: ..., ...exports }
// ESLint flat config doesn't accept objects with unexpected keys like `default`
function getDefault<T>(mod: { default: T } | T): T {
  return (mod as { default: T }).default ?? (mod as T)
}

export default defineConfig(
  // Ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/__snapshots__/**',
      '**/dist/**',
      '**/lib/**',
      '**/coverage/**',
      '**/dtslint/**',
      '**/.typedoc/**',
    ],
  },
  // Base rules for all files (from eslintrc.base.mts)
  {
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
  },
  // TypeScript files only (from eslintrc.ts.mts)
  {
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
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'no-public' },
      ],
      '@typescript-eslint/no-floating-promises': [
        'error',
        { ignoreVoid: true },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true },
      ],
    },
  },
  // Test files
  {
    files: ['**/*.spec.*', '**/*.test.*'],
    rules: {
      'react/no-find-dom-node': 'off',
    },
  },
  // Prettier rules (from eslintrc.prettier.mts)
  getDefault(eslintConfigPrettier),
)
