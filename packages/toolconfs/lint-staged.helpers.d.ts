export interface LinterFn {
  (filenames: string): string | string[]
}

export interface ContextualLinterFn {
  (filenames: string, commands: string[]): string[]
}

export interface CombinableLinterFn {
  (next: ContextualLinterFn): ContextualLinterFn
}

export namespace operators {
  export const wrap: (linterFn: LinterFn) => CombinableLinterFn

  export interface Tapper {
    (filenames: string, commands: string[]): any
  }
  export const tap: (tapper: Tapper) => CombinableLinterFn

  export const finish: ContextualLinterFn
}

export namespace atoms {
  export const prCmds: CombinableLinterFn

  export const prettier: CombinableLinterFn

  export const eslint: CombinableLinterFn
}

export namespace presets {
  export const js: LinterFn

  export const css: LinterFn

  export const md: LinterFn
}

export namespace helpers {
  export const ensureArray: <T>(obj?: T | T[]) => T[]

  export const fileNamesToCliArg: (fileNames: string[]) => string
}
