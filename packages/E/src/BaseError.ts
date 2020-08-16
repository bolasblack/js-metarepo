/**
 * 我们系统内部流转的所有 Error 都应该继承自这个 BaseError ，这样子便于我们后续
 * 对内部的 Error 做一些增强，比如目前已经有的 innerError 属性
 *
 * innerError 主要是用于存储包装之前的 Error 。比如 PostRepository 发起获取某个
 * Post 的网络请求 404 了，得到一个 NetworkError ，比较好的做法不是直接让这个
 * Error 直接向上抛，而是包装成一个 NotFoundError ；同时为了能够保留外部获取最底
 * 层错误信息的可能性，我们可以把 NetworkError 赋值给 NotFoundError 的
 * innerError 属性
 *
 * 上述行为我们已经封装在 [[wrapError]] 函数内，直接使用就好了
 *
 * `innerError` 的思路来自 https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#7102-error-condition-responses
 */
export abstract class BaseError<
  InnerError extends Error = Error
> extends Error {
  innerError?: InnerError

  constructor(message?: string) {
    super(message)

    // TypeScript 和 babel 不一样，在把 class extends 编译到 ES5 时，生成的代码
    // 比较简单：
    //
    //    function CustomError() {
    //      return _super !== null && _super.apply(this, arguments) || this;
    //    }
    //
    // 遇到 Error/Array 这种构造函数本身就会返回对象的情况时，instanceof 之类的
    // 操作符以及原型链都会收到影响，所以我们需要手动改一下 this 的 __proto__
    //
    // 相关文档：
    //   https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
    // Playground:
    //   https://www.typescriptlang.org/play/index.html?target=1#code/MYGwhgzhAEDCCuEAuB7AtgUQE5ZV6ApgB5IEB2AJjNrvgN4BQ0z0wKZyW8wqWAFGgJQwAcwIB+AFzROASzIiAlNEYs1M+AAcC-QcLGKA3NAD0J6AHIaeC9ABGWAmADWMTblRIAnttYALMHloPx0CJnVmAHk7ACsCHgA6CAIkAAUPFG9tSIAzPiQ-WQgAGmgyAgB3BKQwLDEkBPdMzJ8CI1NzR2Q8Amgmz1b-QLJw5gBfBgmGNg4UEAIEkBQRPj5yirhEVEwcPEUEmc5uXkUgA
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * 用一个新的 Error2 来包装旧的 Error1 ，然后把 Error1 赋值到 Error2.innerError
 *
 * @typeparam WrapperError 新的 Error 的类型
 * @param innerError 旧的 Error
 * @param wrapperErrorConstructor 新 Error 的构造函数
 * @param constructArgs 要传给新 Error 构造函数的参数
 * @return 返回的新的 Error
 *
 * @example
 * ```ts
 * const innerError = new TypeError()
 *
 * const err1 = wrapError(
 *   innerError,
 *   AlertError,
 *   '123',
 *   innerError.message,
 * ) // 如果这么写，err1 的类型是 BaseError<Error>
 *
 * const err2 = wrapError<AlertError<TypeError>>(
 *   innerError,
 *   AlertError,
 *   '123',
 *   innerError.message
 * ) // 我们需要这么写，err2 的类型才是我们预期的 AlertError<TypeError>
 * ```
 */
export function wrapError<
  WrapperError extends BaseError<InnerError>,
  InnerError extends Error = Error,
  WrapperErrorConstructor extends new (
    ...args: WrapperErrorConstructorParameters
  ) => WrapperError = new (...args: any[]) => WrapperError,
  WrapperErrorConstructorParameters extends any[] = any[]
>(
  innerError: InnerError,
  wrapperErrorConstructor: WrapperErrorConstructor,
  ...constructArgs: WrapperErrorConstructorParameters
): WrapperError {
  const err = new wrapperErrorConstructor(...constructArgs)
  err.innerError = innerError
  return err
}
