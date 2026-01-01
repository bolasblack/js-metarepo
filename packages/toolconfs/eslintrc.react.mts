import { defineConfig } from 'eslint/config'
import * as react from 'eslint-plugin-react'
import * as reactHooks from 'eslint-plugin-react-hooks'
import * as globals from 'globals'

export default defineConfig(
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
