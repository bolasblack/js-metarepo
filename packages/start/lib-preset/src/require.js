#!/usr/bin/env node

require('@babel/register')({
  babelrc: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        modules: 'cjs',
        targets: {
          node: 'current',
        },
      },
    ],
    require.resolve('@babel/preset-typescript'),
  ],
  extensions: ['.ts', '.js'],
  only: [__dirname],
})

require('./cli')
