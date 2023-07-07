import { RootState, Root, internalStateSym } from './Root'
import {
  Action,
  ActionMap,
  ActionDispatcherMap,
  CaseReducerMap,
  ActionDispatcher,
  NaiveReducer,
  ActionListener,
  ReducerBuilder,
  ActionMapFromCaseReducerMap,
} from './types'
import { composeNaiveReducers } from './utils'

type StateFromCaseReducerMap<CRM> = CRM extends CaseReducerMap<infer S>
  ? S
  : never

type StateFromActionDispatcherMap<ADM> = ADM extends ActionDispatcherMap<
  infer S,
  any
>
  ? S
  : never

export interface Slice<S, As extends ActionMap> {
  actions: ActionDispatcherMap<S, As>
  reducer: NaiveReducer<RootState, Action.Any>
  listen: ActionListener<S>
  subscribe: Root['subscribe']
  getState: Slice.GetState<S>
  setState: Slice.SetState<S>
  unregister: () => void
  unregistered: boolean
}
export namespace Slice {
  export type FromSpec<
    Name extends string,
    Spec extends SliceSpec<any, any>,
  > = Slice<
    Spec['initialState'],
    ActionMapFromCaseReducerMap<Spec['reducers'], Name>
  >

  export type StateType<S extends Slice<any, any>> = S extends Slice<
    infer R,
    any
  >
    ? R
    : never

  export interface GetState<S> {
    (rootState?: RootState): S
  }

  export interface SetState<S> {
    (newState: S, rootState: RootState): RootState
    (newState: S): (rootState: RootState) => RootState
    (setter: (state: S) => S, rootState: RootState): RootState
    (setter: (state: S) => S): (rootState: RootState) => RootState
  }
}

export interface SliceSpec<S, Rs extends CaseReducerMap<S>> {
  initialState: S
  reducers: Rs
}

export function sliceSpec<S, Reducers extends CaseReducerMap<S>>(
  spec: SliceSpec<S, Reducers>,
): SliceSpec<S, Reducers> {
  return spec
}

export function registerSlice<
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
): Slice<S, ActionMapFromCaseReducerMap<Reducers, N>> {
  const unregisteredCtrl = new AbortController()

  // eslint-disable-next-line prefer-const
  let unregisterReducer: undefined | (() => void)

  type AM = ActionMapFromCaseReducerMap<Reducers, N>
  const actions: ActionDispatcherMap<S, AM> = createActionDispatchers(
    name,
    spec.reducers,
    parent,
    unregisteredCtrl.signal,
  )

  const listen: ActionListener<S> = createSliceListener(
    name,
    actions,
    parent,
    unregisteredCtrl.signal,
  )

  const { reducer, builder } = createSliceReducer(
    name,
    spec,
    actions,
    unregisteredCtrl.signal,
  )

  const wrappedGetState = (parentState?: RootState): S =>
    getState(
      name,
      spec,
      parentState ?? parent.getState(),
      unregisteredCtrl.signal,
    )

  const wrappedSetState = (
    newState: S | ((state: S) => S),
    parentState?: RootState,
  ): ((parentState: RootState) => RootState) | RootState => {
    if (!parentState) {
      return parentState => {
        return wrappedSetState(newState, parentState) as RootState
      }
    }

    if (typeof newState !== 'function') {
      return setState(name, newState, parentState, unregisteredCtrl.signal)
    } else {
      return setState(
        name,
        (newState as any)(wrappedGetState(parentState)),
        parentState,
        unregisteredCtrl.signal,
      )
    }
  }

  const slice: Slice<S, ActionMapFromCaseReducerMap<Reducers, N>> = {
    listen,
    actions,
    reducer,
    subscribe: (listener: () => void) => {
      if (unregisteredCtrl.signal.aborted) {
        console.error(
          `Calling unregistered slice "${name}"'s action dispatcher`,
        )
      }

      return parent.subscribe(listener)
    },
    getState: wrappedGetState,
    setState: wrappedSetState as Slice.SetState<S>,
    unregister: () => {
      if (unregisteredCtrl.signal.aborted) return
      unregisterReducer?.()
      unregisteredCtrl.abort()
    },
    get unregistered() {
      return unregisteredCtrl.signal.aborted
    },
  }

  extra?.(builder, slice)

  unregisterReducer = parent.registerReducer(reducer)

  return slice
}

const getState = <S>(
  sliceName: string,
  spec: SliceSpec<S, any>,
  rs: RootState,
  unregisterSignal: AbortSignal,
): S => {
  if (unregisterSignal.aborted) {
    console.error(
      `Calling unregistered slice "${sliceName}"'s action dispatcher`,
    )
  }

  return rs[internalStateSym][sliceName] || spec.initialState
}

const setState = <S>(
  sliceName: string,
  newState: S,
  rs: RootState,
  unregisterSignal: AbortSignal,
): RootState => {
  if (unregisterSignal.aborted) {
    console.error(
      `Calling unregistered slice "${sliceName}"'s action dispatcher`,
    )
  }

  return {
    ...rs,
    [internalStateSym]: {
      ...rs[internalStateSym],
      [sliceName]: newState,
    },
  }
}

function createSliceReducer<S>(
  sliceName: string,
  spec: SliceSpec<S, CaseReducerMap<S>>,
  actionDispatchers: ActionDispatcherMap<
    S,
    ActionMapFromCaseReducerMap<CaseReducerMap<S>, typeof sliceName>
  >,
  unregisterSignal: AbortSignal,
): {
  builder: ReducerBuilder
  reducer: NaiveReducer<RootState, Action.Any>
} {
  const extraReducers: NaiveReducer<RootState, Action.Any>[] = []

  return {
    builder: { when },
    reducer: (rs, a) =>
      composeNaiveReducers(
        createReducerFromSpec(
          sliceName,
          spec,
          actionDispatchers,
          unregisterSignal,
        ),
        ...extraReducers,
      )(rs, a),
  }

  function when(
    matcher:
      | ActionDispatcher.Any
      | ReducerBuilder.ActionMatcher
      | ReducerBuilder.Reducer,
    reducer?: ReducerBuilder.Reducer,
  ): void {
    let _matcher: ReducerBuilder.ActionMatcher
    let _reducer: ReducerBuilder.Reducer

    if (!reducer) {
      _matcher = () => true
      _reducer = matcher as ReducerBuilder.Reducer
    } else if (ActionDispatcher.isActionDispatcher(matcher)) {
      _matcher = matcher.match
      _reducer = reducer
    } else {
      _matcher = matcher as ReducerBuilder.ActionMatcher
      _reducer = reducer
    }

    extraReducers.push((rs, a) => (_matcher(a) ? _reducer(rs, a) : rs))
  }
}

function createReducerFromSpec<S>(
  sliceName: string,
  spec: SliceSpec<S, CaseReducerMap<S>>,
  actionDispatchers: ActionDispatcherMap<
    S,
    ActionMapFromCaseReducerMap<CaseReducerMap<S>, typeof sliceName>
  >,
  unregisterSignal: AbortSignal,
): NaiveReducer<RootState, Action.Any> {
  const matchers: {
    name: string
    match: (a: Action.Any) => boolean
  }[] = Object.keys(actionDispatchers).map(name => ({
    name,
    match: actionDispatchers[name].match,
  }))

  return (s, a) => {
    if (unregisterSignal.aborted) {
      console.error(
        `Calling unregistered slice "${sliceName}"'s action dispatcher`,
      )
    }

    const caseReducers = matchers
      .filter(m => m.match(a))
      .map(m => spec.reducers[m.name])

    if (!caseReducers.length) return s

    const reducer = composeNaiveReducers(...caseReducers)
    const oldSelfState = getState(sliceName, spec, s, unregisterSignal)
    const newSelfState = reducer(oldSelfState, a)
    return setState(sliceName, newSelfState, s, unregisterSignal)
  }
}

function createSliceListener<As extends ActionDispatcherMap<any, any>>(
  sliceName: string,
  actions: As,
  parent: Root,
  unregisterSignal: AbortSignal,
): ActionListener<StateFromActionDispatcherMap<As>> {
  const actionMatchers = Object.values(actions).map(ad => ad.match)
  const defaultMatcher = (a: Action.Any): a is Action.Any =>
    actionMatchers.some(m => m(a))

  return function (
    dispatcher:
      | ActionDispatcher.Any
      | ActionListener.ListenMatcher
      | ActionListener.ListenHandler,
    callback?: ActionListener.ListenHandler,
  ) {
    if (unregisterSignal.aborted) {
      console.error(
        `Calling unregistered slice "${sliceName}"'s action dispatcher`,
      )
    }

    const { matcher, handler } = ActionListener.dispatchArgs(
      dispatcher,
      callback,
    )

    return parent.listen(matcher || defaultMatcher, handler)
  }
}

function createActionDispatchers<
  N extends string,
  Reducers extends CaseReducerMap<any>,
>(
  sliceName: N,
  reducers: Reducers,
  parent: Root,
  unregisterSignal: AbortSignal,
): ActionDispatcherMap<
  StateFromCaseReducerMap<Reducers>,
  ActionMapFromCaseReducerMap<Reducers, N>
> {
  type Ret = ActionDispatcherMap<
    StateFromCaseReducerMap<Reducers>,
    ActionMapFromCaseReducerMap<Reducers, N>
  >

  const actionTypes = Object.keys(reducers) as StringOnly<keyof Reducers>[]

  return actionTypes.reduce((actions, actionType) => {
    const dispatcher: any = ActionDispatcher.create(
      `${sliceName}/${actionType}`,
      parent,
    )

    actions[actionType] = ((...args: any) => {
      if (unregisterSignal.aborted) {
        console.error(
          `Calling unregistered slice "${sliceName}"'s action dispatcher`,
        )
      }

      return dispatcher(...args)
    }) as any
    Object.assign(actions[actionType], dispatcher)

    return actions
  }, {} as Ret)
}

type StringOnly<T> = T extends string ? T : never
