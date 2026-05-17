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
    expectTypeOf<Equals<Map<number, any>, Map<any, number>>>().toEqualTypeOf<'F'>()
    expectTypeOf<
      Equals<{ a: string } & { b: number }, { a: string; b: number }>
    >().toEqualTypeOf<'T'>()
  })

  it('can specify the result type', () => {
    expectTypeOf<Equals<string, string, 'true', 'false'>>().toEqualTypeOf<'true'>()
    expectTypeOf<Equals<string, number, 'true', 'false'>>().toEqualTypeOf<'false'>()
    expectTypeOf<Equals<'a' | 'b', 'a' | 'b', 'true', 'false'>>().toEqualTypeOf<'true'>()
    expectTypeOf<Equals<'a' | 'b', 'a' | 'c', 'true', 'false'>>().toEqualTypeOf<'false'>()
    expectTypeOf<Equals<string[], string[], 'true', 'false'>>().toEqualTypeOf<'true'>()
    expectTypeOf<Equals<string[], number[], 'true', 'false'>>().toEqualTypeOf<'false'>()
    expectTypeOf<Equals<any[], Array<[number]>, 'true', 'false'>>().toEqualTypeOf<'false'>()
    expectTypeOf<Equals<any[], unknown[], 'true', 'false'>>().toEqualTypeOf<'false'>()
    expectTypeOf<
      Equals<Map<number, any>, Map<any, number>, 'true', 'false'>
    >().toEqualTypeOf<'false'>()
    expectTypeOf<
      Equals<{ a: string } & { b: number }, { a: string; b: number }, 'true', 'false'>
    >().toEqualTypeOf<'true'>()
  })
})
