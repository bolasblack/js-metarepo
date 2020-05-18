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
import parallel from './parallel'
import dtsGenerate from './dtsGenerate'
import tsGenerate from './tsGenerate'

type Task = StartPlugin<StartFilesProps, any>

const srcPath = 'src'
const outPath = 'lib'
const src = `${srcPath}/**/*.ts`

const dts = (): Task => sequence(find(src), dtsGenerate(outPath))

const buildCjs = (): Task =>
  sequence(
    find(src),
    read,
    tsGenerate({ module: ts.ModuleKind.CommonJS }),
    babel({}),
    rename((file) => file.replace(/\.ts$/, '.js')),
    write(outPath),
  )

const buildEsm = (): Task =>
  sequence(
    find(src),
    read,
    tsGenerate({ module: ts.ModuleKind.ESNext }),
    babel({}),
    rename((file) => file.replace(/\.ts$/, '.mjs')),
    write(outPath),
  )

export const clean = (): Task => sequence(find(outPath), remove)

export const build = (): Task =>
  sequence(clean(), parallel(dts(), buildCjs(), buildEsm()))

export const watch = (): Task => _watch(src)(build())
