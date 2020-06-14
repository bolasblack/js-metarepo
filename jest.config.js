const fs = require('fs')
const path = require('path')

module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'html'],
  globals: {
    'ts-jest': {
      tsConfig: getTsConfigFileName(),
    },
  },
}

function getTsConfigFileName() {
  return ['tsconfig.test.json', 'tsconfig.json'].filter((f) => {
    return fs.existsSync(path.resolve(process.cwd(), 'tsconfig.test.json'))
  })[0]
}
