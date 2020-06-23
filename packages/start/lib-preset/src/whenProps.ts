import plugin, { StartPlugin, StartFilesProps } from '@start/plugin'

export default function whenProps<
  I extends StartFilesProps,
  O extends StartFilesProps
>(
  condition: (props: StartFilesProps) => boolean | Promise<boolean>,
  target: StartPlugin<I, O>,
): StartPlugin<I, O> {
  return plugin('whenProps', (utils) => async (props) => {
    const runner = (await target)(utils.reporter)
    if (await condition(props)) {
      return await runner(props)
    } else {
      return props as any
    }
  })
}
