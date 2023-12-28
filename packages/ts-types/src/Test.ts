import { Equals } from './Base'
import { Compact } from './Coll'

/**
 * Check if two type are equal else generate a compiler error
 *
 * from https://github.com/ecyrbe/zodios/blob/6e6f3b3dbc3fdd62bc2c043efbdcd0254823fcb4/src/utils.types.ts#L334C1-L339C3
 *
 * @param T - type to check
 * @param U - type to check against
 * @returns true if types are equal else a detailed compiler error
 */
export type Assert<T, U> = Equals<
  T,
  U,
  true,
  { error: 'Types are not equal'; type1: Compact<T>; type2: Compact<U> }
>
