import { ArgsType, FstArgType, SndArgType, ThdArgType } from './Fn'
import { Assert } from './Test'

describe('Fn', () => {
  describe('ArgsType', () => {
    it('should return the arguments type of a function', () => {
      const t1: Assert<ArgsType<() => void>, []> = true
      const t2: Assert<ArgsType<(a: 1) => void>, [a: 1]> = true
      const t3: Assert<ArgsType<(a: 1, c: 2) => void>, [a: 1, c: 2]> = true
      const t4: Assert<
        ArgsType<(a: 1, c: 2, ...args: boolean[]) => void>,
        [a: 1, c: 2, ...args: boolean[]]
      > = true
    })
  })

  describe('FstArgType', () => {
    it('should return the first argument type of a function', () => {
      const t1: Assert<FstArgType<() => void>, never> = true
      const t2: Assert<FstArgType<(a: 1) => void>, 1> = true
      const t3: Assert<FstArgType<(a: 1, c: 2) => void>, 1> = true
      const t4: Assert<
        FstArgType<(a: 1, c: 2, ...args: boolean[]) => void>,
        1
      > = true
    })
  })

  describe('SndArgType', () => {
    it('should return the second argument type of a function', () => {
      const t1: Assert<SndArgType<() => void>, never> = true
      const t2: Assert<SndArgType<(a: 1) => void>, never> = true
      const t3: Assert<SndArgType<(a: 1, c: 2) => void>, 2> = true
      const t4: Assert<SndArgType<(a: 1, c: 2, d: 3) => void>, 2> = true
      const t5: Assert<
        SndArgType<(a: 1, c: 2, ...args: boolean[]) => void>,
        2
      > = true
    })
  })

  describe('ThdArgType', () => {
    it('should return the third argument type of a function', () => {
      const t1: Assert<ThdArgType<() => void>, never> = true
      const t2: Assert<ThdArgType<(a: 1) => void>, never> = true
      const t3: Assert<ThdArgType<(a: 1, c: 2) => void>, never> = true
      const t4: Assert<ThdArgType<(a: 1, c: 2, d: 3) => void>, 3> = true
      const t5: Assert<ThdArgType<(a: 1, c: 2, d: 3, e: 4) => void>, 3> = true
      const t6: Assert<
        ThdArgType<(a: 1, c: 2, d: 3, ...args: boolean[]) => void>,
        3
      > = true
      const t7: Assert<
        ThdArgType<(a: 1, c: 2, ...args: boolean[]) => void>,
        boolean
      > = true
    })
  })
})
