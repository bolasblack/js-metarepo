import {
  Store,
  StoreEnhancer,
  createStore,
  Reducer,
  Observable,
  Middleware,
  applyMiddleware,
  isAction,
} from 'redux'
import $$observable from 'symbol-observable'
import { Action, NaiveReducer, ActionDispatcher, ActionListener } from './types'
import { composeNaiveReducers, composeEnhancers } from './utils'

export const internalStateSym = Symbol('internalState')

export type RegisterReducer = (
  reducer: NaiveReducer<RootState, Action.Any>,
) => () => void

export interface RootState {
  readonly [internalStateSym]: any
}

export interface Root {
  getState: Store<RootState>['getState']
  registerReducer: RegisterReducer
  listen: ActionListener
  dispatch: Store<RootState>['dispatch']
  subscribe: Store<RootState>['subscribe']
  [Symbol.observable](): Observable<RootState>
}

const defaultInitialState = Object.preventExtensions(
  Object.freeze({ [internalStateSym]: {} }),
)

export function createRoot(enhancer?: StoreEnhancer): Root {
  const { enhancer: listenEnhancer, listen } = createListenManager()
  const defaultReducer: Reducer<RootState> = s => s || defaultInitialState

  const store = createStore(
    defaultReducer,
    composeEnhancers(enhancer, listenEnhancer),
  )

  const { registerReducer } = createReducerManager(store)

  return {
    registerReducer,
    listen,
    dispatch: store.dispatch as any,
    subscribe: store.subscribe,
    getState: store.getState,
    [Symbol.observable]: (store as any)[$$observable],
    [$$observable as any]: (store as any)[$$observable],
  }
}

function createListenManager(): {
  enhancer: StoreEnhancer
  listen: ActionListener
} {
  let registered: {
    matcher: ActionListener.ListenMatcher
    handler: ActionListener.ListenHandler
  }[] = []

  const listen: ActionListener = function (
    dispatcher:
      | ActionDispatcher.Any
      | ActionListener.ListenMatcher
      | ActionListener.ListenHandler,
    callback?: ActionListener.ListenHandler,
  ) {
    const { matcher, handler } = ActionListener.dispatchArgs(
      dispatcher,
      callback,
    )
    const pair = { matcher: matcher || ((_a): _a is any => true), handler }
    registered.push(pair)
    return () => {
      registered = registered.filter(i => i !== pair)
    }
  }

  const middleware: Middleware = () => nextDispatch => action => {
    const result = nextDispatch(action)
    registered.forEach(i => {
      if (isAction(action) && i.matcher(action as any)) {
        try {
          i.handler(action as any)
        } catch (err) {
          console.error(err)
        }
      }
    })
    return result
  }

  return {
    listen,
    enhancer: applyMiddleware(middleware),
  }
}

function createReducerManager(store: Store<RootState>): {
  registerReducer: RegisterReducer
} {
  let registeredReducers: NaiveReducer<RootState, Action.Any>[] = []

  const registerReducer: RegisterReducer = r => {
    if (registeredReducers.includes(r)) {
      // TODO
      throw new Error()
    }

    updateReducers(registeredReducers.concat(r))

    return () => {
      updateReducers(registeredReducers.filter(_r => _r !== r))
    }
  }

  return { registerReducer }

  function createRootReducer(): Reducer<RootState, Action.Any> {
    const composedReducer = composeNaiveReducers(...registeredReducers)

    return (s, action) => {
      return composedReducer(s || defaultInitialState, action)
    }
  }

  function updateReducers(reducers: typeof registeredReducers): void {
    registeredReducers = reducers
    store.replaceReducer(createRootReducer() as any)
  }
}
