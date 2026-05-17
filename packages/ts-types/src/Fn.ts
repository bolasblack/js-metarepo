import { AnyFunction } from './Base'
import { Fst, Snd, Thd } from './Coll'

// oxfmt-ignore
/**
 * @deprecated Use builtin type `Parameters<T>` since TypeScript 3.1:
 * https://github.com/Microsoft/TypeScript/blob/v3.1.1/lib/lib.es5.d.ts#L1404
 */
export type ArgsType<T extends AnyFunction> = T extends AnyFunction<infer R> ? R : never

// oxfmt-ignore
export type FstArgType<F extends AnyFunction> = Fst<Parameters<F>>

// oxfmt-ignore
export type SndArgType<F extends AnyFunction> = Snd<Parameters<F>>

// oxfmt-ignore
export type ThdArgType<F extends AnyFunction> = Thd<Parameters<F>>
