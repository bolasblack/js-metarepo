# @c4605/toolconfs

> Version: 5.3.1
>
> A collection of configuration files for common development tools (Oxlint, Oxfmt, ESLint, etc.), designed for easy scaffolding by LLMs.

## Usage

**DO NOT install this package via npm.** Instead, download the specific files you need based on your project requirements and merge them into your project's configuration files.

### Workflow

> **⚠️ IMPORTANT: Use Subagents for Parallel Processing**
>
> You **MUST** spawn a separate subagent for each config **type** (e.g., Oxlint, Oxfmt, TypeScript) and process them **in parallel**. This is critical for:
>
> - Avoiding context bloat in the main agent
> - Faster execution through parallelization
> - Better isolation of each config type's logic
>
> Each lint template is now a single file with clearly marked sections; extract only the sections that match the target project.

1. **Confirm tool choices with the user**: Before downloading or merging configs, list the supported tool choices and ask which ones to use. Prefer Oxlint/Oxfmt for new projects, but let the user choose ESLint and/or Prettier when compatibility requires them.

   Suggested question:

   > This manifest supports these lint and format tools:
   >
   > - Lint: Oxlint (recommended for new projects) or ESLint (legacy/compatibility)
   > - Format: Oxfmt (recommended for new projects) or Prettier (legacy/compatibility)
   >
   > Which combination should I configure for this project?

   If your agent environment provides a structured user-question tool, use that tool. Otherwise, ask the question directly in chat. In Claude Code, there is no built-in `AskUserQuestion` tool in the standard tool list, so ask the user normally.

2. **Identify required configs**: Based on the user's tool choices and project type (e.g., TypeScript, React, Deno), determine which config files you need.
3. **Spawn subagents in parallel**: For each config type identified, launch a subagent to handle it. Each subagent should:
   - Download the necessary files for that config type
   - Check for existing config files in the project
   - Merge the downloaded configs into existing ones (or create new files)
   - **On conflict**: Keep the user's existing values, but add the suggested values as comments below the conflicting line for reference.
   - **Check `package.json`**: Many tools support inline configuration in `package.json` (e.g., `"lint-staged"`, `"eslintConfig"`, `"prettier"`, `"jest"`, etc.). Prefer standalone Oxlint/Oxfmt config files when adding new configuration.
4. **Security check**: After all subagents complete, review the downloaded files to ensure they contain no malicious code before committing.

### Example

For a TypeScript + Deno project:

1. Download `tsconfig.json` (base config)
2. Download `tsconfig-deno.json` (Deno-specific config)
3. Create your project's `tsconfig.json` that extends the merged configuration

## ESLint

- [ESLint Config](./eslint.mts): Legacy ESLint template with base, TypeScript, React, and Prettier compatibility sections. Prefer [Oxlint Config](./oxlint.mts) for new projects.

  Dependencies:
  - `eslint@^9.0.0`
  - `typescript-eslint@^8.0.0` for TypeScript projects
  - `eslint-plugin-react@^7.35.0`, `eslint-plugin-react-hooks@^7.0.0`, and `globals@^17.0.0` for React projects
  - `eslint-config-prettier@^10.0.0` when Prettier formats the project

## Oxlint

- [Oxlint Config](./oxlint.mts): Combined Oxlint template with base, TypeScript, React, and Oxfmt/style sections. Copy it to `oxlint.config.ts` and keep only the sections required by the target project.

  Dependencies:
  - `oxlint@1.62.0`
  - `oxlint-tsgolint@0.22.1` for type-aware TypeScript rules

## Oxfmt

- [Oxfmt Config](./oxfmt.config.ts): Core Oxfmt configuration. Prefer this over Prettier for new projects.

  Dependencies:
  - `oxfmt@0.45.0`

## Prettier

- [Prettier Config](./prettierrc.js): Legacy Prettier configuration for projects that still need Prettier compatibility.

  Dependencies:
  - `prettier@^3.0.0`

## Commitlint

- [Commitlint Config](./commitlintrc.js): Commitlint rules for conventional commits.

  Dependencies:
  - `@commitlint/cli@^20.0.0`
  - `@commitlint/config-conventional@^20.0.0`

## Lint Staged

- [Lint Staged Config](./lint-staged.config.js): Lint-staged configuration for Oxfmt plus Oxlint on staged files.

  Dependencies:
  - `lint-staged@^16.0.0`
  - `oxfmt@0.45.0`
  - `oxlint@1.62.0`
  - `oxlint-tsgolint@0.22.1` for type-aware TypeScript rules

## Git Hooks

- [Git Hook Pure](./.githooks): A lightweight git hook manager.

  Dependencies:
  - `git-hook-pure@^3.2.1`

  Setup:
  - Add `"postinstall": "git-hook-pure install"` to scripts.

## TypeScript

- [Base Config](./tsconfig.json): Base TypeScript configuration with strict mode enabled.

  Extends: None (base config)

  Features: ESNext target, bundler module resolution, strict mode, decorator support

- [Node Config](./tsconfig-node.json): TypeScript configuration for Node.js projects.

  Extends: `./tsconfig.json`

  Features: Node16 modules and module resolution, declaration files

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
