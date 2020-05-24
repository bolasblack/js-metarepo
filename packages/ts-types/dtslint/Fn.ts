import { ArgsType, FstArgType, SndArgType, ThdArgType } from '@c4605/ts-types'

// $ExpectType []
type ArgsTypeT1 = ArgsType<() => void>
// $ExpectType [1]
type ArgsTypeT2 = ArgsType<(a: 1) => void>
// $ExpectType [1, 2]
type ArgsTypeT3 = ArgsType<(a: 1, c: 2) => void>
// $ExpectType [1, 2, ...boolean[]]
type ArgsTypeT4 = ArgsType<(a: 1, c: 2, ...args: boolean[]) => void>
// $ExpectError
const argsTypeV2: ArgsType<(a: 1, b: 2) => void> = [1, 3]

// $ExpectType never
type FstArgTypeT1 = FstArgType<() => void>
// $ExpectType 1
type FstArgTypeT2 = FstArgType<(a: 1) => void>
// $ExpectType 1
type FstArgTypeT3 = FstArgType<(a: 1, c: 2) => void>

// $ExpectType never
type SndArgTypeT1 = SndArgType<() => void>
// $ExpectType never
type SndArgTypeT2 = SndArgType<(a: 1) => void>
// $ExpectType 2
type SndArgTypeT3 = SndArgType<(a: 1, c: 2) => void>
// $ExpectType 2
type SndArgTypeT4 = SndArgType<(a: 1, c: 2, d: 3) => void>

// $ExpectType never
type ThdArgTypeT1 = ThdArgType<() => void>
// $ExpectType never
type ThdArgTypeT2 = ThdArgType<(a: 1) => void>
// $ExpectType never
type ThdArgTypeT3 = ThdArgType<(a: 1, c: 2) => void>
// $ExpectType 3
type ThdArgTypeT4 = ThdArgType<(a: 1, c: 2, d: 3) => void>
// $ExpectType 3
type ThdArgTypeT5 = ThdArgType<(a: 1, c: 2, d: 3, e: 4) => void>
