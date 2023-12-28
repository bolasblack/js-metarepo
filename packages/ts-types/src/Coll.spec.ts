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
import { Assert } from './Test'

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
      const test: [
        Assert<Head<[]>, never>,
        Assert<Head<[number]>, number>,
        Assert<Head<[number, string, boolean]>, number>,
        Assert<Head<number[]>, number>,
      ] = [true, true, true, true]
    })
  })

  describe('Tail', () => {
    it('should return the tail of an array', () => {
      const test: [
        Assert<Tail<[]>, []>,
        Assert<Tail<[number]>, []>,
        Assert<Tail<[number, string, boolean]>, [string, boolean]>,
        Assert<Tail<number[]>, number[]>,
      ] = [true, true, true, true]
    })
  })

  describe('Snd', () => {
    it('should return the second element of an array', () => {
      const test: [
        Assert<Snd<[]>, never>,
        Assert<Snd<[1]>, never>,
        Assert<Snd<[1, 2, 3]>, 2>,
        Assert<Snd<number[]>, number>,
      ] = [true, true, true, true]
    })
  })

  describe('Thd', () => {
    it('should return the third element of an array', () => {
      const test: [
        Assert<Thd<[]>, never>,
        Assert<Thd<[1]>, never>,
        Assert<Thd<[1, 2, 3]>, 3>,
        Assert<Thd<[1, 2, 3, 4]>, 3>,
        Assert<Thd<number[]>, number>,
      ] = [true, true, true, true, true]
    })
  })

  describe('Prepend', () => {
    it('should prepend an element to an array', () => {
      const test: [
        Assert<
          Prepend<string, [number, boolean]>,
          [first: string, number, boolean]
        >,
        Assert<Prepend<string, boolean[]>, [first: string, ...args: boolean[]]>,
      ] = [true, true]
    })
  })

  describe('DeepOptional', () => {
    it('should make all properties optional recursively', () => {
      type T1 = { a: number | null; b?: { c: string } }
      type T2 = DeepOptional<T1>
      const t2: Assert<
        T2,
        {
          a?: number | null | undefined
          b?: { c?: string | undefined } | undefined
        }
      > = true
    })
  })

  describe('DeepRequired', () => {
    it('should make all properties required recursively', () => {
      type T1 = { a?: number | null; b?: { c: string } }
      type T2 = DeepRequired<T1>
      const t2: Assert<T2, { a: number | null; b: { c: string } }> = true
    })
  })

  describe('DeepNonNullable', () => {
    it('should make all properties non-nullable recursively', () => {
      type T1 = { a?: number | null; b?: { c?: string | null } | null }
      type T2 = DeepNonNullable<T1>
      const t2: Assert<T2, { a: number; b: { c: string } }> = true
    })
  })

  describe('OptionalPropNames', () => {
    it('should return the names of optional properties', () => {
      type T1 = { a?: 1 | null; b?: 2; c: 3 | null; d: 4 }
      type T2 = OptionalPropNames<T1>
      const t2: Assert<T2, 'a' | 'b'> = true
    })
  })

  describe('RequiredPropNames', () => {
    it('should return the names of required properties', () => {
      type T1 = { a?: 1 | null; b?: 2; c: 3 | null; d: 4 }
      type T2 = RequiredPropNames<T1>
      const t2: Assert<T2, 'c' | 'd'> = true
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

      const t2: Assert<T2, { b?: 2; c: 3 | null }> = true
      const t3: Assert<T3, { b?: 2; c: 3 | null }> = true
      const t4: Assert<T4, { b?: 2; c: 3 | null }> = true
    })
  })

  describe('RequiredKey', () => {
    it('should modify keys to be required', () => {
      type T1 = { a?: number | null; b?: string | null; c?: null }

      type T2 = RequiredKey<T1, 'b'>
      const t2: Assert<
        T2,
        { a?: number | null | undefined; b: string; c?: null }
      > = true

      type T3 = RequiredKey<T1, 'a' | 'c'>
      const t3: Assert<
        T3,
        { a: number; b?: string | null | undefined; c: never }
      > = true

      type T4 = RequiredKey<RequiredKey<T1, 'a'>, 'c'>
      const t4: Assert<
        T4,
        { a: number; b?: string | null | undefined; c: never }
      > = true

      type T5 = RequiredKey<RequiredKey<RequiredKey<T1, 'a'>, 'c'>, 'b'>
      const t5: Assert<T5, { a: number; b: string; c: never }> = true

      type T6 = RequiredKey<RequiredKey<T1, 'a' | 'c'>, 'b'>
      const t6: Assert<T6, { a: number; b: string; c: never }> = true

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
      const t2: Assert<T2, { a: number | null; b?: string | null }> = true

      type T3 = OptionalKey<T1, 'a' | 'c'>
      const t3: Assert<T3, { a?: number | null; b: string | null; c?: null }> =
        true

      type T4 = OptionalKey<OptionalKey<T1, 'a'>, 'c'>
      const t4: Assert<T4, { a?: number | null; b: string | null; c?: null }> =
        true

      type T5 = OptionalKey<OptionalKey<OptionalKey<T1, 'a'>, 'c'>, 'b'>
      const t5: Assert<T5, { a?: number | null; b?: string | null; c?: null }> =
        true

      type T6 = OptionalKey<OptionalKey<T1, 'a' | 'c'>, 'b'>
      const t6: Assert<T6, { a?: number | null; b?: string | null; c?: null }> =
        true

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
      const t2: Assert<
        T2,
        {
          a?: boolean | null
          b?: { c: boolean | null }
        }
      > = true

      type T3 = DeepType<T1, boolean | string>
      const t3: Assert<
        T3,
        {
          a?: string | boolean | null
          b?: { c: string | boolean | null }
        }
      > = true

      type T4 = DeepType<T1, any>
      const t4: Assert<T4, { a?: any; b?: { c: any } }> = true
    })
  })

  describe('PickNullable', () => {
    it('should pick nullable types', () => {
      const t1: Assert<PickNullable<number>, never> = true
      const t2: Assert<PickNullable<number | null>, null> = true
      const t3: Assert<PickNullable<number | undefined>, undefined> = true
      const t4: Assert<
        PickNullable<number | null | undefined>,
        null | undefined
      > = true
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
      const t1: Assert<
        T1,
        {
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
        }
      > = true
    })
  })
})
