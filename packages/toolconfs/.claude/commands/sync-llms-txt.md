---
description: Sync version and config files to llms.md and README.md for @c4605/toolconfs
allowed-tools: Read, Edit, Write, Glob, Bash, AskUserQuestion
---

# Sync llms.md for @c4605/toolconfs

You are helping to synchronize the `llms.md` manifest file in the `packages/toolconfs` directory.

## llms.txt Specification

Follow the [llmstxt.org](https://llmstxt.org/) specification:

### Required Structure (in order)

1. **H1 Title** - Project name (required)
2. **Blockquote Summary** - Brief overview with version and essential context
3. **Descriptive Content** - Detailed information (optional)
4. **H2 File Lists** - Curated URLs with descriptions

### Writing Guidelines

- Use **concise, clear language**
- Include **brief, informative descriptions** alongside resource links
- Avoid ambiguous terms or unexplained jargon
- Prioritize curated overview over comprehensive documentation

### Best Practices (from Cloudflare's llms.txt)

Reference: https://developers.cloudflare.com/kv/llms-full.txt

- **Consistent structure**: Each config entry should have title, description, and dependencies
- **Hierarchical organization**: Group related configs under H2 sections (ESLint, Prettier, TypeScript, etc.)
- **Explicit parameters**: Document constraints, requirements, and setup steps clearly
- **Cross-references**: Use explicit markdown links `[text](./path)` for file references
- **Practical examples**: Show how to use each config when applicable

## Context Files

Package info:
@packages/toolconfs/package.json

Current llms.md:
@packages/toolconfs/llms.md

Current README.md:
@packages/toolconfs/README.md

Ignore list (if exists):
@packages/toolconfs/.sync-llm-txt-ignores.md

## Tasks

### 1. Sync Version Number

Extract the version from `package.json` and ensure it's reflected in `llms.md`. If llms.md doesn't have a version line, add one near the title like:

```markdown
# @c4605/toolconfs

> Version: X.Y.Z
```

### 2. Scan for Config Files

List all configuration files in `packages/toolconfs/` (excluding `node_modules/`, `.git/`, and meta files like `package.json`, `README.md`, `CHANGELOG.md`, `llms.md`).

Config files typically include:

- `*.js`, `*.mjs`, `*.mts` (eslint, prettier, commitlint, lint-staged configs)
- `*.json` (tsconfig, renovate)
- `.githooks/` directory

### 3. Compare with llms.md

Check which config files are documented in `llms.md` and which are missing.

Read the ignore list from `.sync-llm-txt-ignores.md` if it exists. Files listed there should be skipped.

### 4. **CRITICAL: Verify Dependency Versions**

**This is the most important step. DO NOT SKIP.**

For EVERY config file documented in llms.md, you MUST:

1. **Read the actual config file** to see what packages it imports/requires
2. **Cross-check with `package.json`** to get the actual version ranges
3. **Update llms.md** if any dependency is:
   - **Missing**: Listed in llms.md but not actually used by the config file
   - **Extra**: Used by the config file but not listed in llms.md
   - **Outdated**: Version in llms.md doesn't match the major version in package.json

**Common mistakes to catch:**

- Config file no longer uses a dependency (e.g., `eslint-plugin-prettier` removed but still listed)
- Major version bumps not reflected (e.g., `^5.0.0` → `^7.0.0`)
- Dependencies listed that were never actually used

**Example verification for `eslintrc.prettier.mts`:**

```
1. Read eslintrc.prettier.mts → imports `eslint-config-prettier`
2. Check package.json → `eslint-config-prettier: ^10.1.8`
3. Check llms.md → lists `eslint-config-prettier@^9.0.0` and `eslint-plugin-prettier@^5.0.0`
4. FIX: Remove eslint-plugin-prettier, update version to ^10.0.0
```

### 5. Handle New Files

For any config files NOT in llms.md and NOT in the ignore list:

- Ask the user if they want to add it to llms.md
- If YES: Add an appropriate entry following llmstxt.org format:
  - Markdown link to the file: `[Config Name](./filename)`
  - Brief, informative description of what it configures
  - Dependencies section with version requirements
  - Setup instructions if applicable
- If NO: Add the filename to `.sync-llm-txt-ignores.md`

### 6. Validate llms.txt Format

Ensure the updated llms.md follows the specification:

- H1 title at the top
- Blockquote with version and summary
- H2 sections grouping related configs
- Consistent entry format within each section
- Clear, concise language without jargon

## Output

After completing all tasks, summarize:

1. Version synced (old -> new, or "unchanged")
2. **Dependency versions updated** (list each config file and what changed)
3. Files added to llms.md
4. Files added to ignore list
5. Changes made to README.md

$ARGUMENTS
