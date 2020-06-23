import plugin, { StartPlugin, StartFilesProps } from '@start/plugin'

export default function mapProps<
  I extends StartFilesProps,
  O extends StartFilesProps
>(mapper: (props: I) => O | Promise<O>): StartPlugin<I, O> {
  return plugin('mapProps', () => (props: I) => {
    return mapper(props)
  })
}
