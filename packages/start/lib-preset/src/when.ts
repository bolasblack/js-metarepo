import plugin, { StartFile, StartPlugin, StartFilesProps } from '@start/plugin'

export default function when<
  I extends StartFilesProps,
  O extends StartFilesProps
>(
  condition: (file: StartFile) => boolean | Promise<boolean>,
  target: StartPlugin<I, O>,
): StartPlugin<I, O> {
  return plugin('when', (utils) => async ({ files: inputFiles }) => {
    const filesRes = await Promise.all(
      inputFiles.map(
        async (file: StartFile): Promise<boolean> => {
          utils.logPath(file.path)
          return await condition(file)
        },
      ),
    )

    const processedFiles = (
      await (await target)(utils.reporter)({
        files: inputFiles.filter((f, idx) => filesRes[idx]),
      } as any)
    ).files.slice()

    return {
      files: inputFiles.map((f, idx) =>
        filesRes[idx] ? processedFiles.shift() : f,
      ),
    } as any
  })
}
