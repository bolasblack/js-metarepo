import * as ts from 'typescript'
import plugin, {
  StartFile,
  StartPlugin,
  StartDataFile,
  StartDataFilesProps,
} from '@start/plugin'

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
export default function tsGenerate(
  compilerOptions?: Partial<ts.CompilerOptions>,
): StartPlugin<StartDataFilesProps, StartDataFilesProps> {
  return plugin(
    'tsGenerate',
    ({ logPath }) => async ({ files }: StartDataFilesProps) => {
      const { transpileModule } = await import('typescript')
      const fs = await import('fs')
      const options = { ...compilerOptions }

      return {
        files: files.map(
          (file: StartFile): StartDataFile => {
            logPath(file.path)

            const data = file.data || fs.readFileSync(file.path).toString()

            const newContent = transpileModule(data, {
              compilerOptions: options,
            }).outputText

            return { ...file, data: newContent }
          },
        ),
      }
    },
  )
}
