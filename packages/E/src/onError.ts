/**
 * 一个帮助函数，主要用于 `Promise` 的 `.catch` 方法。
 *
 * 返回一个新函数，当新函数的参数符合 `predicate` 时，回调 `handler`。
 * `handler` 的返回值会被 `onError` 返回
 *
 * PS. `predicate` 参数原本支持传入构造函数（`onError(ConflictHttpError)`），后
 * 来发现这个设计存在问题，因为 `Error()` 类似 `Boolean()`/`Number()` ，没有
 * `new` 关键字时也会返回对象，使得判断始终为真，引发 BUG 。最终我们移除了这个设
 * 计
 *
 * @example
 *
 * ```js
 * fetch(url)
 *   .then(raiseHttpErrors)
 *   .catch(onError(instanceOf(ConflictHttpError), err => {
 *     return 123
 *   }))
 *   .catch(onError(isAxiosError, err => {
 *     return 123
 *   }))
 *   .then(data => {
 *      data === 123 // => true
 *   })
 * ```
 *
 * 柯里化：
 *
 * ```js
 * const onConflict = onError(instanceOf(ConflictHttpError))
 *
 * fetch(url)
 *   .then(raiseHttpErrors)
 *   .catch(onConflict(err => {
 *     return 123
 *   }))
 *   .then(data => {
 *      data === 123 // => true
 *   })
 * ```
 *
 * @param predicate 一个返回布尔值的函数
 * @param handler 当错误的类匹配时要回调的函数
 */
export function onError<T1, T2>(
  predicate: ErrPredicate<T1>,
): (handler: Handler<T1, T2>) => VoidToUndefined<T2>
export function onError<T1, T2>(
  predicate: ErrPredicate<T1>,
  handler: Handler<T1, T2>,
): VoidToUndefined<T2>
export function onError<T1, T2>(
  predicate: ErrPredicate<T1>,
  handler?: Handler<T1, T2>,
): any {
  if (!handler) {
    return (handler: Handler<T1, T2>): any => onError(predicate, handler)
  }

  return (err: T1): any => {
    if (predicate(err)) return handler(err)

    throw err
  }
}

export namespace onError {
  export type Handler<T1, T2> = (err: T1) => T2

  export type ErrPredicate<T> = (err: any) => err is T
}

type ErrPredicate<T> = onError.ErrPredicate<T>

type Handler<T1, T2> = onError.Handler<T1, T2>

type VoidToUndefined<T> = T extends void ? undefined : T
