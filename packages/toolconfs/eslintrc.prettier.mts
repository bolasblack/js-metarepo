import { defineConfig } from 'eslint/config'
import * as eslintConfigPrettier from 'eslint-config-prettier'

// Helper to extract default export from namespace imports
// This handles CommonJS modules where `import * as` creates { default: ..., ...exports }
// ESLint flat config doesn't accept objects with unexpected keys like `default`
function getDefault<T>(mod: { default: T } | T): T {
  return (mod as { default: T }).default ?? (mod as T)
}

export default defineConfig(getDefault(eslintConfigPrettier))
