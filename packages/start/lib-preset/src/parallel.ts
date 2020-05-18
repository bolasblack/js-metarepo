import plugin, { StartPlugin, StartFilesProps } from '@start/plugin'

export default function parallel(
  ...targets: StartPlugin<any, any>[]
): StartPlugin<StartFilesProps, StartFilesProps> {
  return plugin('parallel', (utils) => {
    return async (props) => {
      await Promise.all(
        targets.map(async (target) => {
          const targetRunner = await target
          await targetRunner(utils.reporter)(props)
        }),
      )

      return props
    }
  })
}
