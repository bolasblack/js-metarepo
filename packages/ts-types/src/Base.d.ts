import { Compact } from './Coll'

export type SimpleJSON<T = string> = Record<string, T>

// prettier-ignore
export type AnyFunction<AS extends any[] = any[]> = (...args: AS) => any

/**
 * from https://github.com/gcanti/typelevel-ts
 *
 * @example
 * function f<T extends AnyTuple>(x: T): T {
 *   return x
 * }
 * const x: [number] = [1]
 * const y: [number, string] = [1, 'a']
 * const z: [number, string, boolean] = [1, 'a', true]
 * f(x)
 * f(y)
 * f(z)
 * // $ExpectError
 * // f([1, 2, 3])
 */
export type AnyTuple = Array<any> & { '0': any }

export type AnyObject<T = unknown> = Record<string, T>

/**
 * Returns the string literal 'T' if `A` and `B` are equal types, 'F' otherwise
 *
 * from https://github.com/gcanti/typelevel-ts
 *
 * @example
 * import { Equals } from 'typelevel-ts'
 *
 * export type Result1 = Equals<string, string> // "T"
 * export type Result2 = Equals<string, number> // "F"
 */
export type Equals<A, B> = (<C>() => C extends Compact<A> ? 'T' : 'F') extends <
  C
>() => C extends Compact<B> ? 'T' : 'F'
  ? 'T'
  : 'F'
