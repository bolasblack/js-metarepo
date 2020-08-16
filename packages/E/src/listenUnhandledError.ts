/**
 * 在顶层注册所有未处理的错误（支持浏览器/WebWorker/node.js）
 *
 * 在 Chrome 里，非当前域名下的 js 脚本抛错时，ErrorEvent#error 会是 null，为了
 * 确保 errorHandler 始终能够得到一些错误信息（也是为了能让 isErrorShown 依旧能
 * 生效），所以我们会传入一个 ErrorEvent
 *
 * PS. 其实这个问题可以通过给 `<script>` 标签添加 `crossorigin` 属性来解决
 */
export function listenUnhandledError<T>(
  errorHandler: (err: T | ErrorEvent) => any,
): () => void {
  if (
    typeof module !== 'undefined' &&
    typeof global !== 'undefined' &&
    module.exports
  ) {
    return listenUnhandledErrorInNode(errorHandler)
  } else {
    return listenUnhandledErrorInBrowser(errorHandler)
  }
}

function listenUnhandledErrorInNode<T>(
  errorHandler: (err: T | ErrorEvent) => any,
): () => void {
  const errorEventCallback = (error: any, origin: string): void => {
    if (origin === 'unhandledRejection') return
    errorHandler(error)
  }
  process.addListener('uncaughtException', errorEventCallback as any)

  const unhandledrejectionEventCallback = (reason: any): void => {
    errorHandler(reason)
  }
  process.addListener('unhandledRejection', unhandledrejectionEventCallback)

  const unlistener = (): void => {
    process.removeListener('error', errorEventCallback)
    process.removeListener(
      'unhandledRejection',
      unhandledrejectionEventCallback,
    )
  }

  return unlistener
}

function listenUnhandledErrorInBrowser<T>(
  errorHandler: (err: T | ErrorEvent) => any,
): () => void {
  const errorEventCallback = (event: ErrorEvent): void => {
    errorHandler(event.error || event)
  }
  addEventListener('error', errorEventCallback)

  const unhandledrejectionEventCallback = (
    event: PromiseRejectionEvent,
  ): void => {
    errorHandler(event.reason)
  }
  addEventListener('unhandledrejection', unhandledrejectionEventCallback)

  const unlistener = (): void => {
    removeEventListener('error', errorEventCallback)
    removeEventListener('unhandledrejection', unhandledrejectionEventCallback)
  }

  return unlistener
}
