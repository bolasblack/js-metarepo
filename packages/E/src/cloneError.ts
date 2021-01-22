export interface ClonedError {
  // Standard
  name: string
  message: string

  // Mozilla
  fileName?: string
  lineNumber?: string
  columnNumber?: string
  stack?: string

  // Safari
  line?: number
  sourceId?: string
  sourceURL?: string
  expressionBeginOffset?: number
  expressionCaretOffset?: number
  expressionEndOffset?: number

  // Opera
  stacktrace?: string
}

/**
 * 如果 Error 直接传到 postMessage 里，会报错说 An object could not be cloned
 *
 * 所以需要手动转换成普通的 Object ，再由另一头重新转成 Error
 *
 * https://github.com/getsentry/raven-js/blob/b7fa854dc688609f1a4cb53c36a84f6436217e79/vendor/TraceKit/tracekit.js#L342
 */
export const cloneError = (err: Error): ClonedError => {
  const _err: any = err

  return {
    ...err,
    name: err.name,
    message: err.message,

    // Safari
    line: _err.line,
    sourceId: _err.sourceId,
    sourceURL: _err.sourceURL,
    expressionBeginOffset: _err.expressionBeginOffset,
    expressionCaretOffset: _err.expressionCaretOffset,
    expressionEndOffset: _err.expressionEndOffset,

    // Mozilla
    fileName: _err.fileName,
    lineNumber: _err.lineNumber,
    columnNumber: _err.columnNumber,
    stack: _err.stack,

    // Opera
    stacktrace: _err.stacktrace,
  }
}
