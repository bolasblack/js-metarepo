import { vi, beforeAll } from 'vitest'

export {}

declare global {
  const jest: typeof vi
}

beforeAll(() => {
  ;(globalThis as any).jest = vi
})
