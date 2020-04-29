# @c4605/metarepo

The metarepo is a single repository that consists of many packages and various monorepos, a new concept that may simplify the development process. Many of the projects presented here are dependencies of each other, so we can iterate in all at the same time and benefit from using [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

Inspired from [nextools/metarepo](https://github.com/nextools/metarepo)

## Unit test

### Run unit test

```
yarn test
```

### Run unit test in watch mode

1. Install [watchman](https://facebook.github.io/watchman/)
1. `yarn test --watch`

## Release

1. `cp .envrc.example .envrc`
1. Edit `.envrc`
1. Install [direnv](https://direnv.net/)
1. `direnv allow`
