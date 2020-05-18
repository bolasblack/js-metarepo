import {
  getPreEmitDiagnostics,
  flattenDiagnosticMessageText,
  CompilerOptions,
} from 'typescript'
import plugin, { StartPlugin, StartFile, StartFilesProps } from '@start/plugin'

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
export default function dtsGenerate(
  outDirRelative: string,
  compilerOptions?: CompilerOptions,
): StartPlugin<StartFilesProps, StartFilesProps> {
  return plugin(
    'dtsGenerate',
    ({ logPath }) => async ({ files }: StartFilesProps) => {
      const { createProgram } = await import('typescript')
      const path = await import('path')
      const options = {
        ...compilerOptions,
        declarationDir: path.resolve(outDirRelative),
        declaration: true,
        emitDeclarationOnly: true,
      }
      const filePaths = files.map((file: StartFile) => file.path)

      filePaths.forEach(logPath)

      const program = createProgram(filePaths, options)
      const emitResult = program.emit()
      const allDiagnostics = getPreEmitDiagnostics(program).concat(
        emitResult.diagnostics,
      )

      allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
          const {
            line,
            character,
          } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!)
          const pos = `${diagnostic.file.fileName} (${line + 1},${
            character + 1
          })`

          const message = flattenDiagnosticMessageText(
            diagnostic.messageText,
            '\n',
          )

          console.log(`${pos}: ${message}`)
        } else {
          console.log(
            `${flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`,
          )
        }
      })

      return { files }
    },
  )
}
