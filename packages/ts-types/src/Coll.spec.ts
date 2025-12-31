import { expectTypeOf } from 'vitest'
import {
  Compact,
  Exact,
  Head,
  Tail,
  Prepend,
  Snd,
  Thd,
  DeepNonNullable,
  DeepRequired,
  DeepOptional,
  OptionalPropNames,
  RequiredPropNames,
  ExcludeKey,
  RequiredKey,
  OptionalKey,
  DeepType,
  DeepPick,
  PickNullable,
} from './Coll'

describe('Coll', () => {
  describe('Exact', () => {
    it('should work', () => {
      function exactf1<T extends Exact<{ a: string }, T>>(a: T): void {}
      const exact1: { a: string } = null as any
      const exact2: { a: string; b: number } = null as any
      const exact3: { a: string; b: any } = null as any

      exactf1(exact1)
      // @ts-expect-error function should only accept exact { a: string }
      exactf1(exact2)
      // @ts-expect-error function should only accept exact { a: string }
      exactf1(exact3)
    })
  })

  describe('Head', () => {
    it('should return the first element of an array', () => {
      expectTypeOf<Head<[]>>().toEqualTypeOf<never>()
      expectTypeOf<Head<[number]>>().toEqualTypeOf<number>()
      expectTypeOf<Head<[number, string, boolean]>>().toEqualTypeOf<number>()
      expectTypeOf<Head<number[]>>().toEqualTypeOf<number>()
    })
  })

  describe('Tail', () => {
    it('should return the tail of an array', () => {
      expectTypeOf<Tail<[]>>().toEqualTypeOf<[]>()
      expectTypeOf<Tail<[number]>>().toEqualTypeOf<[]>()
      expectTypeOf<Tail<[number, string, boolean]>>().toEqualTypeOf<
        [string, boolean]
      >()
      expectTypeOf<Tail<number[]>>().toEqualTypeOf<number[]>()
    })
  })

  describe('Snd', () => {
    it('should return the second element of an array', () => {
      expectTypeOf<Snd<[]>>().toEqualTypeOf<never>()
      expectTypeOf<Snd<[1]>>().toEqualTypeOf<never>()
      expectTypeOf<Snd<[1, 2, 3]>>().toEqualTypeOf<2>()
      expectTypeOf<Snd<number[]>>().toEqualTypeOf<number>()
    })
  })

  describe('Thd', () => {
    it('should return the third element of an array', () => {
      expectTypeOf<Thd<[]>>().toEqualTypeOf<never>()
      expectTypeOf<Thd<[1]>>().toEqualTypeOf<never>()
      expectTypeOf<Thd<[1, 2, 3]>>().toEqualTypeOf<3>()
      expectTypeOf<Thd<[1, 2, 3, 4]>>().toEqualTypeOf<3>()
      expectTypeOf<Thd<number[]>>().toEqualTypeOf<number>()
    })
  })

  describe('Prepend', () => {
    it('should prepend an element to an array', () => {
      expectTypeOf<Prepend<string, [number, boolean]>>().toEqualTypeOf<
        [first: string, number, boolean]
      >()
      expectTypeOf<Prepend<string, boolean[]>>().toEqualTypeOf<
        [first: string, ...args: boolean[]]
      >()
    })
  })

  describe('DeepOptional', () => {
    it('should make all properties optional recursively', () => {
      type T1 = { a: number | null; b?: { c: string } }
      type T2 = DeepOptional<T1>
      expectTypeOf<T2>().toEqualTypeOf<{
        a?: number | null | undefined
        b?: { c?: string | undefined } | undefined
      }>()
    })
  })

  describe('DeepRequired', () => {
    it('should make all properties required recursively', () => {
      type T1 = { a?: number | null; b?: { c: string } }
      type T2 = DeepRequired<T1>
      expectTypeOf<T2>().toEqualTypeOf<{ a: number | null; b: { c: string } }>()
    })
  })

  describe('DeepNonNullable', () => {
    it('should make all properties non-nullable recursively', () => {
      type T1 = { a?: number | null; b?: { c?: string | null } | null }
      type T2 = DeepNonNullable<T1>
      expectTypeOf<T2>().toEqualTypeOf<{ a: number; b: { c: string } }>()
    })
  })

  describe('OptionalPropNames', () => {
    it('should return the names of optional properties', () => {
      type T1 = { a?: 1 | null; b?: 2; c: 3 | null; d: 4 }
      type T2 = OptionalPropNames<T1>
      expectTypeOf<T2>().toEqualTypeOf<'a' | 'b'>()
    })
  })

  describe('RequiredPropNames', () => {
    it('should return the names of required properties', () => {
      type T1 = { a?: 1 | null; b?: 2; c: 3 | null; d: 4 }
      type T2 = RequiredPropNames<T1>
      expectTypeOf<T2>().toEqualTypeOf<'c' | 'd'>()
    })
  })

  describe('ExcludeKey', () => {
    it('should exclude keys from a type', () => {
      // prettier-ignore
      type OriginalExcludeKey<T, EK extends keyof T> = Compact<
        { [K in Exclude<OptionalPropNames<T>, EK>]?: T[K] } &
        { [K in Exclude<keyof T, EK | OptionalPropNames<T>>]: T[K] }
      >

      type T1 = { a?: 1 | null; b?: 2; c: 3 | null; d: 4 }
      type T2 = OriginalExcludeKey<T1, 'a' | 'd'>
      type T3 = Omit<T1, 'a' | 'd'>
      type T4 = ExcludeKey<T1, 'a' | 'd'>

      expectTypeOf<T2>().toEqualTypeOf<{ b?: 2; c: 3 | null }>()
      expectTypeOf<T3>().toEqualTypeOf<{ b?: 2; c: 3 | null }>()
      expectTypeOf<T4>().toEqualTypeOf<{ b?: 2; c: 3 | null }>()
    })
  })

  describe('RequiredKey', () => {
    it('should modify keys to be required', () => {
      type T1 = { a?: number | null; b?: string | null; c?: null }

      type T2 = RequiredKey<T1, 'b'>
      expectTypeOf<T2>().toEqualTypeOf<{
        a?: number | null | undefined
        b: string
        c?: null
      }>()

      type T3 = RequiredKey<T1, 'a' | 'c'>
      expectTypeOf<T3>().toEqualTypeOf<{
        a: number
        b?: string | null | undefined
        c: never
      }>()

      type T4 = RequiredKey<RequiredKey<T1, 'a'>, 'c'>
      expectTypeOf<T4>().toEqualTypeOf<{
        a: number
        b?: string | null | undefined
        c: never
      }>()

      type T5 = RequiredKey<RequiredKey<RequiredKey<T1, 'a'>, 'c'>, 'b'>
      expectTypeOf<T5>().toEqualTypeOf<{ a: number; b: string; c: never }>()

      type T6 = RequiredKey<RequiredKey<T1, 'a' | 'c'>, 'b'>
      expectTypeOf<T6>().toEqualTypeOf<{ a: number; b: string; c: never }>()

      type RequiredKeyT7 = RequiredKey<
        { a?: number | null; b?: string | null },
        // @ts-expect-error c should not acceptable
        'c'
      >
    })
  })

  describe('OptionalKey', () => {
    it('should modify keys to be optional', () => {
      type T1 = { a: number | null; b: string | null; c: null }

      type T2 = OptionalKey<{ a: number | null; b: string | null }, 'b'>
      expectTypeOf<T2>().toEqualTypeOf<{
        a: number | null
        b?: string | null
      }>()

      type T3 = OptionalKey<T1, 'a' | 'c'>
      expectTypeOf<T3>().toEqualTypeOf<{
        a?: number | null
        b: string | null
        c?: null
      }>()

      type T4 = OptionalKey<OptionalKey<T1, 'a'>, 'c'>
      expectTypeOf<T4>().toEqualTypeOf<{
        a?: number | null
        b: string | null
        c?: null
      }>()

      type T5 = OptionalKey<OptionalKey<OptionalKey<T1, 'a'>, 'c'>, 'b'>
      expectTypeOf<T5>().toEqualTypeOf<{
        a?: number | null
        b?: string | null
        c?: null
      }>()

      type T6 = OptionalKey<OptionalKey<T1, 'a' | 'c'>, 'b'>
      expectTypeOf<T6>().toEqualTypeOf<{
        a?: number | null
        b?: string | null
        c?: null
      }>()

      type OptionalKeyT7 = OptionalKey<
        { a: number | null; b: string | null },
        // @ts-expect-error c should not acceptable
        'c'
      >
    })
  })

  describe('DeepType', () => {
    it('should assign all properties to the specified type recursively', () => {
      type T1 = { a?: number | null; b?: { c: string | null } }

      type T2 = DeepType<T1, boolean>
      expectTypeOf<T2>().toEqualTypeOf<{
        a?: boolean | null
        b?: { c: boolean | null }
      }>()

      type T3 = DeepType<T1, boolean | string>
      expectTypeOf<T3>().toEqualTypeOf<{
        a?: string | boolean | null
        b?: { c: string | boolean | null }
      }>()

      type T4 = DeepType<T1, any>
      expectTypeOf<T4>().toEqualTypeOf<{ a?: any; b?: { c: any } }>()
    })
  })

  describe('PickNullable', () => {
    it('should pick nullable types', () => {
      expectTypeOf<PickNullable<number>>().toEqualTypeOf<never>()
      expectTypeOf<PickNullable<number | null>>().toEqualTypeOf<null>()
      expectTypeOf<
        PickNullable<number | undefined>
      >().toEqualTypeOf<undefined>()
      expectTypeOf<PickNullable<number | null | undefined>>().toEqualTypeOf<
        null | undefined
      >()
    })
  })

  describe('DeepPick', () => {
    it('should pick properties from all levels of a type', () => {
      const DeepPickV1 = { a: true, c: { e: true, f: { g: true } } }
      type DeepPickT1 = {
        a?: string | null
        b?: number | null
        c?: {
          e?: number[] | null
          f?: {
            g?: string | null
          } | null
        } | null
      }

      type T1 = DeepPick<DeepPickT1, typeof DeepPickV1>
      expectTypeOf<T1>().toEqualTypeOf<{
        a: string | null | undefined
        c:
          | {
              e: number[] | null | undefined
              f:
                | {
                    g: string | null | undefined
                  }
                | null
                | undefined
            }
          | null
          | undefined
      }>()
    })
  })
})
