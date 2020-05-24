const path = require('path')

const wrap = (fn) => (next) => (filenames, commands) =>
  ensureArray(next(filenames, ensureArray(commands))).concat(fn(filenames))

const tap = (fn) => (next) => (filenames, commands) => {
  fn(filenames, commands)
  return ensureArray(next(filenames, ensureArray(commands)))
}

const finish = (filenames, commands) => commands

const prettier = wrap((filenames) => {
  if (!filenames.length) return []

  const cliFileNames = fileNamesToCliArg(filenames)

  // prettier-ignore
  return [
    'yarn prettier --write ' + cliFileNames,
  ]
})

const eslint = wrap((filenames) => {
  if (!filenames.length) return []

  const cliFileNames = fileNamesToCliArg(
    filenames.filter((f) => !f.includes('eslint')),
  )

  // prettier-ignore
  return [
    'yarn eslint ' + cliFileNames,
  ]
})

const prCmds = tap((filenames, cmds) => console.log('cmds', cmds))

module.exports = {
  operators: {
    wrap,
    tap,
    finish,
  },
  atoms: {
    prCmds,
    prettier,
    eslint,
  },
  presets: {
    js: eslint(prettier(finish)),
    css: prettier(finish),
    md: prettier(finish),
  },
  helpers: {
    ensureArray,
    fileNamesToCliArg,
  },
}

function ensureArray(obj) {
  if (obj == null) return []
  return Array.isArray(obj) ? obj : [obj]
}

function fileNamesToCliArg(names, base = process.cwd()) {
  return names.map((f) => path.relative(base, f)).join(' ')
}
