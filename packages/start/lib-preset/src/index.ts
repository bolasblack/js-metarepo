import { StartPlugin, StartFilesProps } from '@start/plugin'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import remove from '@start/plugin-remove'
import read from '@start/plugin-read'
import rename from '@start/plugin-rename'
import write from '@start/plugin-write'
import _watch from '@start/plugin-watch'
import babel from '@start/plugin-lib-babel'
import * as ts from 'typescript'
import when from './when'
import whenProps from './whenProps'
import mapProps from './mapProps'
import parallel from './parallel'
import dtsGenerate from './dtsGenerate'
import tsGenerate from './tsGenerate'

type Task = StartPlugin<StartFilesProps, any>

const tsconfig = getTsConfig()

if (!tsconfig) {
  console.error('tsconfig.json in current working directory is required')
  process.exit(1)
}

const srcPath = 'src'
const outPath = tsconfig.outDir || 'lib'
const src = `${srcPath}/**/*.{ts,tsx,js,jsx}`

const dts = (): Task => sequence(find(src), dtsGenerate(outPath, tsconfig))

const buildCjs = (): Task =>
  sequence(
    whenProps((props) => !props.files.length, find(src)),
    when((f) => !f.data, read),
    when(
      (f) => f.path.endsWith('ts') || f.path.endsWith('tsx'),
      tsGenerate({ ...tsconfig, module: ts.ModuleKind.CommonJS }),
    ),
    babel({}),
    rename((file) => file.replace(/\.tsx?$/, '.js')),
    write(outPath),
  )

const buildEsm = (): Task =>
  sequence(
    whenProps((props) => !props.files.length, find(src)),
    when((f) => !f.data, read),
    when(
      (f) => f.path.endsWith('ts') || f.path.endsWith('tsx'),
      tsGenerate({ ...tsconfig, module: ts.ModuleKind.ESNext }),
    ),
    babel({}),
    rename((file) => file.replace(/\.tsx?$/, '.mjs')),
    write(outPath),
  )

const incrementalBuild = (): Task => parallel(dts(), buildCjs(), buildEsm())

export const clean = (): Task =>
  sequence(
    find(outPath),
    remove,
    mapProps(() => ({ files: [] })),
  )

export const build = (): Task => sequence(clean(), incrementalBuild())

export const watch = (): Task => _watch(src)(incrementalBuild())

function getTsConfig(): ts.CompilerOptions | undefined {
  const parseConfigHost: ts.ParseConfigHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    useCaseSensitiveFileNames: true,
  }

  const configFileName = ts.findConfigFile(
    process.cwd(),
    ts.sys.fileExists,
    'tsconfig.json',
  )

  if (!configFileName) return

  const configFile = ts.readConfigFile(configFileName, ts.sys.readFile)

  if (configFile.error) {
    console.error(configFile.error)
    return
  }

  return ts.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    process.cwd(),
  ).options
}
