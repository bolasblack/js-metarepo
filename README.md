# @c4605/metarepo

The metarepo is a single repository that consists of many packages and various monorepos, a new concept that may simplify the development process. Many of the projects presented here are dependencies of each other, so we can iterate in all at the same time and benefit from using [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

Inspired from [nextools/metarepo](https://github.com/nextools/metarepo)

- [`toolconfs`](packages/toolconfs): Some configuration files for usual tools.
- [`ts-types`](packages/ts-types): Some useful TypeScript type helpers.
- [`start`](packages/start): Some [start](https://github.com/nextools/metarepo/tree/master/packages/start) presets/plugins.
- [`yarw`](packages/yarw): A typesafe, effective redux wrapper.
- [`E`](packages/E): A try to build an error handling solution.
