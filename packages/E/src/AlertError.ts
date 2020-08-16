import { BaseError, wrapError } from './BaseError'

type ErrParamaters = ConstructorParameters<typeof Error>

/**
 * Alertable 是一种特殊接口，当收到任何一个错误有实现这个接口时，说明抛出这个错
 * 误的代码认为自己已经提供了一个可以直接向用户展示的错误信息，所以除非当前代码
 * 确认自己能够提供一个更有针对性的错误信息，否则应该直接继承或者展示当前错误的
 * `displayMessage` 属性值
 *
 * @example
 *
 * ```js
 * doSomething().catch(onError(isErrorAlertable, err => {
 *   alertService.showAlert({ message: err.displayMessage })
 *
 *   throw new OtherError({
 *     innerError: err,
 *     displayMessage: err.displayMessage,
 *   })
 * }))
 * ```
 */
export interface AlertableError {
  /**
   * 用于展示的文案
   */
  displayMessage: string
}

/**
 * 判断 Error 是否匹配 AlertableError 接口
 *
 * 在顶层处理 Error 时，尽量使用 isAlertableError 而不是 instanceof AlertError
 * 作为判断方式，因为当前代码可能和其他我们自己写的库使用的 @c4/e 版本不同，会
 * 导致出现多个 AlertError 构造函数，这个时候 instanceof 就不总是生效了
 */
export function isAlertableError(e: any): e is AlertableError {
  return e instanceof Error && 'displayMessage' in e
}

/**
 * 这个 AlertError 作为 AlertableError 增强版，并且和 BaseError 有很好的结合，
 * 我们内部绝大部分需要提示的地方都应该直接使用 AlertError 而不是自己构造一个符
 * 合 AlertableError 接口的 Error 实例
 */
export class AlertError<InnerError extends Error = Error>
  extends BaseError<InnerError>
  implements AlertableError {
  displayMessage: string

  static wrap<InnerError extends Error>(
    innerError: InnerError,
    displayMessage: string,
  ): AlertError<InnerError> {
    return wrapError(innerError, AlertError, displayMessage, innerError.message)
  }

  constructor(displayMessage: string, ...rest: ErrParamaters)
  constructor(
    displayMessage: string,
    innerError: InnerError,
    ...rest: ErrParamaters
  )
  constructor(displayMessage: string, ...rest: any[]) {
    let innerError: InnerError | undefined
    if (rest.length && rest[0] instanceof Error) {
      innerError = rest[0] as any
      rest = rest.slice(1)
    }

    super(...rest)

    this.displayMessage = displayMessage
    if (innerError) {
      this.innerError = innerError
    }
  }
}
