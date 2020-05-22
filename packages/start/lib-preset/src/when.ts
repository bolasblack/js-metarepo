import plugin, { StartFile, StartPlugin, StartFilesProps } from '@start/plugin'

export default function when<
  I extends StartFilesProps,
  O extends StartFilesProps
>(
  condition: (file: StartFile) => boolean | Promise<boolean>,
  target: StartPlugin<I, O>,
): StartPlugin<I, I | O> {
  return plugin('when', (utils) => async ({ files }) => {
    const runner = (await target)(utils.reporter)
    const outFiles = await Promise.all(
      files.map(
        async (file: StartFile): Promise<StartFile[]> => {
          utils.logPath(file.path)

          if (await condition(file)) {
            const res = await runner({ files: [file] } as any)
            return res.files
          }

          return [file]
        },
      ),
    )

    return {
      files: flat(outFiles),
    } as any
  })
}

function flat<T>(items: T[][]): T[] {
  return items.reduce((res, items) => {
    res.push(...items)
    return res
  }, [])
}
