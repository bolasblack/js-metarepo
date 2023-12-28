import { defineProject } from 'vitest/config'
import * as fs from 'fs'
import * as path from 'path'

export default defineProject({
  test: {
    watch: process.env.LERNA_TEST ? false : true,
    globals: true,
    setupFiles: [path.resolve(__dirname, './config/vitestSetup.ts')],
    typecheck: {
      tsconfig: getTsConfigFileName(),
      enabled: true,
    },
  },
})

function getTsConfigFileName(): undefined | string {
  return ['tsconfig.test.json', 'tsconfig.json'].filter(() => {
    return fs.existsSync(path.resolve(process.cwd(), 'tsconfig.test.json'))
  })[0]
}
