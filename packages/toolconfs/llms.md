# @c4605/toolconfs

> Version: 5.3.1
>
> A collection of configuration files for common development tools (ESLint, Prettier, etc.), designed for easy scaffolding by LLMs.

## Usage

**DO NOT install this package via npm.** Instead, download the specific files you need based on your project requirements and merge them into your project's configuration files.

### Workflow

> **⚠️ IMPORTANT: Use Subagents for Parallel Processing**
>
> You **MUST** spawn a separate subagent for each config **type** (e.g., ESLint, Prettier, TypeScript) and process them **in parallel**. This is critical for:
>
> - Avoiding context bloat in the main agent
> - Faster execution through parallelization
> - Better isolation of each config type's logic
>
> Multiple files of the same type (e.g., `eslintrc.base.mts` and `eslintrc.ts.mts`) should be handled within a single subagent.

1. **Identify required configs**: Based on your project type (e.g., TypeScript, React, Deno), determine which config files you need.
2. **Spawn subagents in parallel**: For each config type identified, launch a subagent to handle it. Each subagent should:
   - Download the necessary files for that config type
   - Check for existing config files in the project
   - Merge the downloaded configs into existing ones (or create new files)
   - **On conflict**: Keep the user's existing values, but add the suggested values as comments below the conflicting line for reference.
   - **Check `package.json`**: Many tools support inline configuration in `package.json` (e.g., `"prettier"`, `"lint-staged"`, `"eslintConfig"`, `"jest"`, etc.). Always check `package.json` for existing config fields related to the tool you're configuring.
3. **Security check**: After all subagents complete, review the downloaded files to ensure they contain no malicious code before committing.

### Example

For a TypeScript + Deno project:

1. Download `tsconfig.json` (base config)
2. Download `tsconfig-deno.json` (Deno-specific config)
3. Create your project's `tsconfig.json` that extends the merged configuration

## ESLint

- [Base (JavaScript)](./eslintrc.base.mts): Basic ESLint rules for JavaScript.

  Dependencies:
  - `eslint@^9.0.0`

- [TypeScript](./eslintrc.ts.mts): TypeScript specific rules.

  Dependencies:
  - `typescript-eslint@^8.0.0`

- [React](./eslintrc.react.mts): React specific rules.

  Dependencies:
  - `eslint-plugin-react@^7.35.0`
  - `eslint-plugin-react-hooks@^7.0.0`
  - `globals@^16.0.0`

- [Prettier](./eslintrc.prettier.mts): Disables ESLint rules that conflict with Prettier.

  Dependencies:
  - `eslint-config-prettier@^10.0.0`

## Prettier

- [Prettier Config](./prettierrc.js): Core Prettier configuration.

  Dependencies:
  - `prettier@^3.0.0`

## Commitlint

- [Commitlint Config](./commitlintrc.js): Commitlint rules for conventional commits.

  Dependencies:
  - `@commitlint/cli@^20.0.0`
  - `@commitlint/config-conventional@^20.0.0`

## Lint Staged

- [Lint Staged Config](./lint-staged.config.js): Lint-staged configuration.

  Dependencies:
  - `lint-staged@^16.0.0`

## Git Hooks

- [Git Hook Pure](./.githooks): A lightweight git hook manager.

  Dependencies:
  - `git-hook-pure@^3.2.1`

  Setup:
  - Add `"postinstall": "git-hook-pure install"` to scripts.

## TypeScript

- [Base Config](./tsconfig.json): Base TypeScript configuration with strict mode enabled.

  Extends: None (base config)

  Features: ESNext target, strict mode, decorator support

- [Node Config](./tsconfig-node.json): TypeScript configuration for Node.js projects.

  Extends: `./tsconfig.json`

  Features: CommonJS modules, declaration files

- [ESModule Config](./tsconfig-esModule.json): TypeScript configuration with ESModule interop.

  Extends: `./tsconfig.json`

  Features: esModuleInterop enabled

- [Deno Config](./tsconfig-deno.json): TypeScript configuration for Deno projects.

  Extends: `./tsconfig.json`

## Renovate

- [Renovate Config](./renovate.json): Automated dependency updates configuration.

  Features:
  - Extends `config:base` and `:semanticCommitTypeAll(chore)`
  - Uses `replace` strategy for regular dependencies
  - Uses `widen` strategy for peer dependencies
