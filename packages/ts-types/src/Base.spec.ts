import { Equals } from './Base'

describe('Base', () => {
  it('should work', () => {
    expectTypeOf<Equals<string, string>>().toEqualTypeOf<'T'>()
    expectTypeOf<Equals<string, number>>().toEqualTypeOf<'F'>()
    expectTypeOf<Equals<'a' | 'b', 'a' | 'b'>>().toEqualTypeOf<'T'>()
    expectTypeOf<Equals<'a' | 'b', 'a' | 'c'>>().toEqualTypeOf<'F'>()
    expectTypeOf<Equals<string[], string[]>>().toEqualTypeOf<'T'>()
    expectTypeOf<Equals<string[], number[]>>().toEqualTypeOf<'F'>()
    expectTypeOf<Equals<any[], Array<[number]>>>().toEqualTypeOf<'F'>()
    expectTypeOf<Equals<any[], unknown[]>>().toEqualTypeOf<'F'>()
    expectTypeOf<
      Equals<Map<number, any>, Map<any, number>>
    >().toEqualTypeOf<'F'>()
    expectTypeOf<
      Equals<{ a: string } & { b: number }, { a: string; b: number }>
    >().toEqualTypeOf<'T'>()
  })

  it('can specify the result type', () => {
    const test1: Equals<string, string, 'true', 'false'> = 'true'
    const test2: Equals<string, number, 'true', 'false'> = 'false'
    const test3: Equals<'a' | 'b', 'a' | 'b', 'true', 'false'> = 'true'
    const test4: Equals<'a' | 'b', 'a' | 'c', 'true', 'false'> = 'false'
    const test5: Equals<string[], string[], 'true', 'false'> = 'true'
    const test6: Equals<string[], number[], 'true', 'false'> = 'false'
    const test7: Equals<any[], Array<[number]>, 'true', 'false'> = 'false'
    const test8: Equals<any[], unknown[], 'true', 'false'> = 'false'
    const test9: Equals<
      Map<number, any>,
      Map<any, number>,
      'true',
      'false'
    > = 'false'
    const test10: Equals<
      { a: string } & { b: number },
      { a: string; b: number },
      'true',
      'false'
    > = 'true'
  })
})
