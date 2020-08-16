import { BaseError } from './BaseError'

/**
 * [[assert]] 函数抛出的异常
 */
export class AssertionError extends BaseError {}

/**
 * 判断 `assertion` 是否为真，如果不是，则抛出 `message` 为 `msg` 的
 * 异常 [[AssertionError]]
 *
 * `assertion` 支持函数
 */
export function assert(
  assertion: boolean | (() => boolean),
  msg?: string,
): asserts assertion {
  if (typeof assertion === 'function') {
    if (!assertion()) {
      throw new AssertionError(msg)
    }
  } else if (!assertion) {
    throw new AssertionError(msg)
  }
}
