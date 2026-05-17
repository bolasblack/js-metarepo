---
name: eslint-oxlint-alignment
description: 'Align ESLint and Oxlint configurations during lint setup, migration, or template maintenance. Use when configuring ESLint and Oxlint together, migrating ESLint to Oxlint, updating lint rule templates, comparing rule parity, changing lint scripts, reviewing inline lint disables, or modifying packages/toolconfs ESLint/Oxlint config templates such as eslint.mts, oxlint.mts, eslint.config.*, oxlint.config.*, eslintrc*, or oxlintrc*.'
metadata:
  version: '1.0.0'
---

# ESLint/Oxlint Alignment

Use this skill to keep ESLint and Oxlint configurations semantically aligned. The goal is not merely to make lint pass; the goal is to preserve rule intent, file coverage, package-script behavior, and template/runtime boundaries.

## Critical Rules

- Activate this skill before modifying `packages/toolconfs` ESLint/Oxlint config templates or runtime configs.
- Never claim a migration is 1:1 until `--print-config` validates the effective config for representative files from the same working directory used by package scripts.
- Distinguish runtime configs from published templates. Do not let template files accidentally become the config used to lint the current repository.
- Do not assume Oxlint `extends` behaves like ESLint flat config. Verify merged `rules`, `overrides`, `plugins`, `categories`, and `ignorePatterns` in printed config.
- In monorepos, always account for script cwd. A package script such as `oxlint src` is evaluated from that package directory.
- Add React, Prettier/style, Jest/Vitest, browser globals, or framework-specific rules only when the target project actually uses that stack.

## Workflow

### 1. Inventory lint surfaces

Find all relevant files and commands before editing:

- ESLint configs: `eslint.config.*`, `.eslintrc.*`, `package.json` `eslintConfig`, shared config templates.
- Oxlint configs: `.oxlintrc.json`, `.oxlintrc.jsonc`, `oxlint.config.ts`, explicit `--config` paths, shared config templates.
- Package scripts: `lint`, `lint:*`, `prepublishOnly`, workspace runners such as Lerna/Nx/Turbo.
- Staged-file hooks: `lint-staged`, git hooks, CI workflow lint commands.
- Inline directives: `eslint-disable*`, `eslint-enable*`, `oxlint-disable*`, `oxlint-enable*`.

Classify each lint config as one of:

- Runtime config for this repository.
- Package-level runtime override.
- Published template for other projects or LLM extraction.
- Obsolete config that should be removed.

### 2. Establish the intended loading model

For ESLint:

- Flat configs commonly use `eslint.config.mjs`, `eslint.config.mts`, or similar.
- Package scripts may rely on ESLint resolving a root config from subdirectories.

For Oxlint:

- Auto-discovered runtime config names include `.oxlintrc.json` and `oxlint.config.ts`.
- `oxlint.config.mts` can be used only when explicitly passed with `--config`; do not assume auto-discovery.
- Passing `--config` disables nested config lookup and uses that one config.
- Package-level configs must be validated from the package script cwd.

Prefer one of these runtime strategies:

1. Use auto-discovered `oxlint.config.ts` in each package that runs Oxlint from its own cwd.
2. Use scripts with explicit `--config` paths when the project deliberately wants non-auto-discovered names.
3. Use JSON configs only when static JSON is enough and `extends` behavior has been verified.

### 3. Build a parity table

Compare ESLint and Oxlint by intent, not just by rule name. For each rule/config item, record:

- Source rule and severity.
- File scope or override glob.
- Options.
- Oxlint equivalent rule or category.
- Whether the Oxlint rule is core, TypeScript, React, or another plugin.
- Whether it requires `--type-aware` or `oxlint-tsgolint`.
- Semantic differences, unsupported options, or missing equivalents.

Always include these non-rule items:

- Ignore patterns.
- Parser/project/type-aware settings.
- Environments and globals.
- Plugin activation.
- Test-file overrides.
- Formatting/Prettier conflict handling.
- React/browser/framework sections.
- Package scripts and lint-staged command coverage.
- Inline disable rule-name changes.

### 4. Known rule and config pitfalls

- `@typescript-eslint/no-unused-vars` maps most closely to Oxlint `no-unused-vars`, not a separate `typescript/no-unused-vars` rule.
- Oxlint `no-unused-vars` supports TypeScript constructs, but its defaults can differ from `@typescript-eslint/no-unused-vars`; especially check type-only usage behavior and options such as `reportVarsOnlyUsedAsTypes`.
- Disabling a rule that was never enabled is usually a no-op; keep it only if it belongs in a reusable template.
- `eslint-config-prettier` has no direct universal Oxlint equivalent. If Prettier owns formatting, avoid enabling Oxlint style rules unless intentionally chosen.
- React template rules are for React projects only; do not add React plugin/rules to non-React runtime configs.
- Oxlint categories can enable or disable broad sets of rules. Verify category settings in `--print-config`; do not rely on defaults.
- Nested or extended configs may not merge all fields the way ESLint does. Validate printed output.

### 5. Validate effective configs

For every package or app that runs lint, validate from the same cwd as its script. Pick representative files:

- JavaScript file if JS is linted.
- TypeScript file if TS is linted.
- TSX/JSX file if React is linted.
- Test file if test-specific overrides exist.
- File in any package-specific override path.

Use commands like:

```sh
oxlint --print-config src/index.ts
oxlint --type-aware --print-config src/index.ts
```

If ESLint remains in use, compare with:

```sh
eslint --print-config src/index.ts
```

Check that printed config includes expected:

- Plugins.
- Categories.
- Rules and severities.
- Rule options.
- Overrides.
- Ignore behavior.

Then run the actual commands used by users and CI, such as:

```sh
pnpm lint
pnpm exec oxlint --type-aware .
```

### 6. Update inline directives deliberately

When replacing ESLint with Oxlint:

- Convert only directives that remain necessary.
- Map rule names to Oxlint rule names.
- Run with unused-disable reporting when available.
- Prefer removing obsolete disables over mechanically renaming them.

### 7. Maintain paired templates

When maintaining a config-template package that publishes both ESLint and Oxlint templates:

- Keep the same section model across both files: base, TypeScript, React, Prettier/style, test, framework sections as applicable.
- Put LLM-facing comments near the top telling agents to extract only needed sections.
- Avoid naming a template as an auto-discovered runtime config unless the package should actually lint itself with that template.
- Document dependencies per optional section, not as if every consumer must install every plugin.

## Output Format for Audits

When asked to audit or review alignment, report:

1. Conclusion: aligned, mostly aligned, or not aligned.
2. Rules/configs that are equivalent.
3. Missing, non-equivalent, or unsupported items with severity.
4. Loading or script-cwd problems.
5. Recommended fixes.
6. Verification commands run.

Keep the report concise unless the user asks for full tables.

## Version History

- v1.0.0 (2026-05-17): Initial skill for ESLint/Oxlint rule and config parity workflows.
