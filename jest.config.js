const fs = require('fs')
const path = require('path')

module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: getTsConfigFileName() }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'html'],
}

function getTsConfigFileName() {
  return ['tsconfig.test.json', 'tsconfig.json'].filter(() => {
    return fs.existsSync(path.resolve(process.cwd(), 'tsconfig.test.json'))
  })[0]
}
