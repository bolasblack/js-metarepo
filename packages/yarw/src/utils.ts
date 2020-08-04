import { StoreEnhancer } from 'redux'
import { NaiveReducer, Action } from './types'

const compose = (...fns: any[]): any => {
  const _fns = fns.slice()
  _fns.reverse()

  return (i: any, ...extra: any[]) => {
    return _fns.reduce((o, fn) => fn(o, ...extra), i)
  }
}

export function composeEnhancers(
  ...enhancers: (StoreEnhancer | undefined)[]
): StoreEnhancer {
  const _enhancers = enhancers.filter((e): e is StoreEnhancer => Boolean(e))
  return compose(..._enhancers)
}

export function composeNaiveReducers<S, A extends Action.Any>(
  ...reducers: NaiveReducer<S, A>[]
): NaiveReducer<S, A> {
  return compose(...reducers)
}
