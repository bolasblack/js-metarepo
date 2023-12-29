# @c4605/toolconfs

Some configuration files for usual tools

- [`commitlintrc.js`](https://github.com/conventional-changelog/commitlint/): commitlint checks if your commit messages meet the [conventional commit format](https://conventionalcommits.org/).

  ```js
  // .commitlintrc.js
  module.exports = {
    extends: ['@c4605/toolconfs/commitlintrc'],
    rules: {},
  }
  ```

  And install packages:

  ```bash
  yarn add @commitlint/config-conventional -D
  ```

- [`prettierrc.yml`](https://github.com/prettier/prettier): Prettier is an opinionated code formatter.

  ```json
  // package.json
  {
    "prettier": "@c4605/toolconfs/prettierrc"
  }
  ```

- [`renovate.json`](https://renovatebot.com/docs/): Automated dependency updates service.

  ```json
  {
    "extends": ["github>bolasblack/js-metarepo:packages/toolconfs/renovate"]
  }
  ```

- [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html): The presence of a `tsconfig.json` file in a directory indicates that the directory is the root of a TypeScript project. The `tsconfig.json` file specifies the root files and the compiler options required to compile the project.

  ```json
  {
    "$schema": "https://json.schemastore.org/tsconfig.json",
    "extends": "@c4605/toolconfs/tsconfig",
    "extends": "@c4605/toolconfs/tsconfig-node",
    "extends": "@c4605/toolconfs/tsconfig-esModule"
  }
  ```

- `eslintrc.[type].js`: eslint config for TypeScript

  ```yml
  // .eslintrc.js
  module.exports = {
    extends: [
      "./node_modules/@c4605/toolconfs/eslintrc.base",
      "./node_modules/@c4605/toolconfs/eslintrc.prettier",
      "./node_modules/@c4605/toolconfs/eslintrc.ts",
    ],
    parserOptions: {
      project: './tsconfig.json',
    },
  }
  ```

  And install packages:

  ```bash
  yarn add -D eslint \
    @typescript-eslint/eslint-plugin @typescript-eslint/parser \
    eslint-config-prettier eslint-plugin-prettier \
    eslint-plugin-react eslint-plugin-react-hooks
  ```

- [`.githooks`](https://github.com/bolasblack/git-hook-pure): git hook more freely and quickly

- [`lint-staged.config.js`](https://github.com/okonet/lint-staged): Run linters against staged git files and don't let 💩 slip into your code base!

  ```js
  module.exports = require('@c4605/toolconfs/lint-staged.config')
  ```
