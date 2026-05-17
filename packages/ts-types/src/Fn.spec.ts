import { expectTypeOf } from 'vitest'
import { ArgsType, FstArgType, SndArgType, ThdArgType } from './Fn'

describe('Fn', () => {
  describe('ArgsType', () => {
    it('should return the arguments type of a function', () => {
      expectTypeOf<ArgsType<() => void>>().toEqualTypeOf<[]>()
      expectTypeOf<ArgsType<(a: 1) => void>>().toEqualTypeOf<[a: 1]>()
      expectTypeOf<ArgsType<(a: 1, c: 2) => void>>().toEqualTypeOf<[a: 1, c: 2]>()
      expectTypeOf<ArgsType<(a: 1, c: 2, ...args: boolean[]) => void>>().toEqualTypeOf<
        [a: 1, c: 2, ...args: boolean[]]
      >()
    })
  })

  describe('FstArgType', () => {
    it('should return the first argument type of a function', () => {
      expectTypeOf<FstArgType<() => void>>().toEqualTypeOf<never>()
      expectTypeOf<FstArgType<(a: 1) => void>>().toEqualTypeOf<1>()
      expectTypeOf<FstArgType<(a: 1, c: 2) => void>>().toEqualTypeOf<1>()
      expectTypeOf<FstArgType<(a: 1, c: 2, ...args: boolean[]) => void>>().toEqualTypeOf<1>()
    })
  })

  describe('SndArgType', () => {
    it('should return the second argument type of a function', () => {
      expectTypeOf<SndArgType<() => void>>().toEqualTypeOf<never>()
      expectTypeOf<SndArgType<(a: 1) => void>>().toEqualTypeOf<never>()
      expectTypeOf<SndArgType<(a: 1, c: 2) => void>>().toEqualTypeOf<2>()
      expectTypeOf<SndArgType<(a: 1, c: 2, d: 3) => void>>().toEqualTypeOf<2>()
      expectTypeOf<SndArgType<(a: 1, c: 2, ...args: boolean[]) => void>>().toEqualTypeOf<2>()
    })
  })

  describe('ThdArgType', () => {
    it('should return the third argument type of a function', () => {
      expectTypeOf<ThdArgType<() => void>>().toEqualTypeOf<never>()
      expectTypeOf<ThdArgType<(a: 1) => void>>().toEqualTypeOf<never>()
      expectTypeOf<ThdArgType<(a: 1, c: 2) => void>>().toEqualTypeOf<never>()
      expectTypeOf<ThdArgType<(a: 1, c: 2, d: 3) => void>>().toEqualTypeOf<3>()
      expectTypeOf<ThdArgType<(a: 1, c: 2, d: 3, e: 4) => void>>().toEqualTypeOf<3>()
      expectTypeOf<ThdArgType<(a: 1, c: 2, d: 3, ...args: boolean[]) => void>>().toEqualTypeOf<3>()
      expectTypeOf<ThdArgType<(a: 1, c: 2, ...args: boolean[]) => void>>().toEqualTypeOf<boolean>()
    })
  })
})
