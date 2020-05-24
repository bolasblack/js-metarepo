module.exports = {
  extends: ['plugin:react/recommended'],
  plugins: ['react-hooks'],
  globals: {
    React: 'readonly',
    ReactDOM: 'readonly',
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
}
