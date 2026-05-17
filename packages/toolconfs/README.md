# @c4605/toolconfs

Some configuration files for usual tools.

This package provides a manifest file designed for LLMs to easily scaffold configurations. Prefer Oxlint/Oxfmt over ESLint/Prettier for new projects unless compatibility requires the older tools.

**Manifest URL**: `https://raw.githubusercontent.com/bolasblack/js-metarepo/develop/packages/toolconfs/llms.md`

### How to use

1.  Copy the Manifest URL above.
2.  Paste it into your chat with an LLM (Claude, ChatGPT, Gemini, etc.).
3.  Ask it to install the configurations you need.

**Example Prompt:**

> I want to configure Oxlint and Oxfmt for my React project. Please use the manifest at `https://raw.githubusercontent.com/bolasblack/js-metarepo/develop/packages/toolconfs/llms.md` to help me download the config files and install dependencies.

## Why moved to LLM-oriented?

Check out [this](./docs/moved-to-llm-oriented.en.md), [中文版](./docs/moved-to-llm-oriented.zh.md)

## How to migrate from NPM Usage (Legacy way)

1.  Copy the Manifest URL above.
2.  Paste it into your chat with an LLM (Claude, ChatGPT, Gemini, etc.).
3.  Ask it to fetch the manifest and update your project.
