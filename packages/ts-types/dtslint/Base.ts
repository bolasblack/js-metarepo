import { Equals } from '@c4605/ts-types'

// $ExpectType "T"
type EqualsT1 = Equals<string, string>
// $ExpectType "F"
type EqualsT2 = Equals<string, number>
// $ExpectType "T"
type EqualsT3 = Equals<'a' | 'b', 'a' | 'b'>
// $ExpectType "F"
type EqualsT4 = Equals<'a' | 'b', 'a' | 'c'>
// $ExpectType "T"
type EqualsT5 = Equals<string[], string[]>
// $ExpectType "F"
type EqualsT6 = Equals<string[], number[]>
// $ExpectType "F"
type EqualsT7 = Equals<any[], Array<[number]>>
// $ExpectType "F"
type EqualsT8 = Equals<any[], unknown[]>
// $ExpectType "F"
type EqualsT9 = Equals<Map<number, any>, Map<any, number>>
// $ExpectType "T"
type EqualsT10 = Equals<{ a: string } & { b: number }, { a: string; b: number }>
