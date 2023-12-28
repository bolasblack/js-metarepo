import { useEffect, useState, DependencyList, useMemo } from 'react'
import {
  Action,
  ActionDispatcher,
  CaseReducerMap,
  ReducerBuilder,
  ActionMapFromCaseReducerMap,
} from './types'
import { Slice, SliceSpec, registerSlice } from './Slice'
import { Root } from './Root'

export function useSlice<S extends Slice<any, any>>(
  slice: S,
): useSlice.Return<S>
export function useSlice<
  N extends string,
  S,
  Reducers extends CaseReducerMap<S>,
>(
  parent: Root,
  name: N,
  spec: SliceSpec<S, Reducers>,
  extra?: (
    builder: ReducerBuilder,
    slice: Slice<S, ActionMapFromCaseReducerMap<Reducers, N>>,
  ) => void,
): useSlice.Return<Slice<S, ActionMapFromCaseReducerMap<Reducers, N>>>
export function useSlice(...args: any[]): useSlice.Return<any> {
  const [slice, unregisterSlice] = useMemo<
    [Slice<any, any>, (() => void) | undefined]
  >(() => {
    if (args.length < 3) {
      return [args[0], undefined]
    } else {
      const slice = (registerSlice as any)(...args)
      return [slice, slice.unregister]
    }
  }, [...args])

  // unregister previous slice if created by useSlice
  useEffect(() => unregisterSlice, [unregisterSlice])

  return useMemo(
    () => ({
      actions: slice.actions,
      useSelector: createUseSelector(slice),
      useEffect: createUseEffect(slice),
    }),
    [slice],
  )
}
export namespace useSlice {
  export interface UseSelector<S> {
    (): S
    <R>(selector: (state: S) => R, deps?: DependencyList): R
  }

  export interface UseEffect {
    <A extends Action.Any = Action.Any>(
      listener: (action: A) => any,
      deps?: DependencyList,
    ): void
    <A extends Action.Any = Action.Any>(
      actionFilter: (action: Action.Any) => boolean,
      listener: (action: A) => any,
      deps?: DependencyList,
    ): void
    <A extends Action.Any = Action.Any>(
      actionDispatcher: ActionDispatcher.Any<any, A>,
      listener: (action: A) => any,
      deps?: DependencyList,
    ): void
  }

  export interface Return<S extends Slice<any, any>> {
    actions: S['actions']
    useSelector: UseSelector<Slice.StateType<S>>
    useEffect: UseEffect
  }
}

export function createUseSelector<S>(
  slice: Slice<S, any>,
): useSlice.UseSelector<S> {
  return (_selector?: (s: S) => any, deps: DependencyList = []): any => {
    const selector = useMemo(
      () =>
        _selector ? () => _selector(slice.getState()) : () => slice.getState(),
      deps,
    )

    const [state, setState] = useState(selector)

    useEffect(() => slice.subscribe(() => setState(selector())), [selector])

    useEffect(() => {
      setState(selector())
    }, [selector])

    return state
  }
}

export function createUseEffect(
  slice: Slice<any, any>,
  useEffectPassedIn: typeof useEffect = useEffect,
): useSlice.UseEffect {
  const useSliceEffect: useSlice.UseEffect = (
    _dispatcher?: any,
    _callback?: any,
    _deps?: any,
  ) => {
    let matcher: ((action: Action.Any) => action is Action.Any) | undefined
    let callback: (action: Action.Any) => any
    let deps: DependencyList

    if (_callback == null || Array.isArray(_callback)) {
      // useSliceEffect(action => {})
      // useSliceEffect(action => {}, [])
      deps = _callback
      callback = _dispatcher
      matcher = undefined
    } else if (ActionDispatcher.isActionDispatcher(_dispatcher)) {
      // useSliceEffect(actionDispatcher, action => {})
      // useSliceEffect(actionDispatcher, action => {}, [])
      deps = _deps
      callback = _callback
      matcher = _dispatcher.match
    } else {
      // useSliceEffect(actionFilter, action => {})
      // useSliceEffect(actionFilter, action => {}, [])
      deps = _deps
      callback = _callback
      matcher = _dispatcher
    }

    useEffectPassedIn(() => {
      if (!matcher) {
        return slice.listen(callback)
      }

      return slice.listen(matcher, callback)
    }, deps)
  }

  return useSliceEffect
}
