import { Root, RootState } from './Root'

/**
 * A normal [action](https://redux.js.org/basics/actions)
 */
export interface Action<T = any, P = undefined> {
  type: T
  payload: P
}
export namespace Action {
  export type Payload<P> = Action<any, P>
  export type Empty = Action<any>
  export type Any = Action<any, any>
}
export type ActionFromCaseReducer<R> = R extends CaseReducer<any, infer A>
  ? A
  : never
export type ActionMap = {
  [type: string]: Action.Any
}
export type ActionMapFromCaseReducerMap<Rs> = {
  [type in keyof Rs]: ActionFromCaseReducer<Rs[type]>
}

export type TypeFromAction<A> = A extends Action<infer T> ? T : never
export type PayloadFromAction<A> = A extends Action<any, infer P> ? P : never

/**
 * A function to create an [[Action]]
 */
export type ActionCreator<A extends Action.Any> = A extends Action.Empty
  ? ActionCreator.ForEmptyAction<A>
  : ActionCreator.ForPayloadAction<A>
export namespace ActionCreator {
  /**
   * A [[ActionCreator]] to create an non-payload [[Action]]
   */
  export interface ForEmptyAction<A extends Action.Any> {
    (): A
  }

  /**
   * A [[ActionCreator]] to create an payload [[Action]]
   */
  export interface ForPayloadAction<A extends Action.Any> {
    (payload: PayloadFromAction<A>): A
  }

  export type Any<A extends Action.Any = Action.Any> =
    | ActionCreator.ForEmptyAction<A>
    | ActionCreator.ForPayloadAction<A>
}

// 类型参数 S 用来在有些场景下推断 ActionDispatcher 所属 Slice 的 State 类型
/**
 * A function that can dispatch the corresponding action.
 */
export type ActionDispatcher<S, A extends Action.Any> = A extends Action.Empty
  ? ActionDispatcher.ForEmptyAction<S, A>
  : ActionDispatcher.ForPayloadAction<S, A>
export namespace ActionDispatcher {
  /** @hidden */
  const isActionDispatcherSym = Symbol('isActionDispatcher')

  /**
   * Create an [[ActionDispatcher]]
   *
   * @param [[Action.type]]
   * @param
   */
  export function create<S, A extends Action<any>>(
    type: TypeFromAction<A>,
    parent: Root,
  ): ActionDispatcher.Any<S, A> {
    const actionCreator = (...args: any[]): Action<A> => {
      return { type, payload: args[0] }
    }

    const dispatcher = (...args: any): void => {
      parent.dispatch((actionCreator as any)(...args))
    }

    dispatcher.match = (a: Action.Any): a is A => a.type === type

    dispatcher.create = actionCreator

    dispatcher.toString = () => String(type)

    dispatcher[isActionDispatcherSym] = true

    return dispatcher as ActionDispatcher<S, A>
  }

  /**
   * Check if `fn` is an [[ActionDispatcher]]
   */
  export function isActionDispatcher<S, A extends Action.Any>(
    fn: (...args: any) => any,
  ): fn is ActionDispatcher<S, A> {
    return fn[isActionDispatcherSym]
  }

  /** @hidden */
  interface Base<A extends Action.Any> {
    /**
     * Check if an [[Action]] matches the current [[ActionDispatcher]]
     */
    match(a: Action.Any): a is A

    /**
     * Create a new [[Action]]
     */
    create: ActionCreator<A>

    /**
     * Transform [[ActionDispatcher]] to [[Action.type]]
     */
    toString(): string
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  export interface ForEmptyAction<S, A extends Action.Any> extends Base<A> {
    (): A
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  export interface ForPayloadAction<S, A extends Action.Any> extends Base<A> {
    (payload: PayloadFromAction<A>): A
  }

  export type Any<S = any, A extends Action.Any = Action.Any> =
    | ActionDispatcher.ForEmptyAction<S, A>
    | ActionDispatcher.ForPayloadAction<S, A>
}
export type ActionDispatcherMap<S, As extends ActionMap> = {
  [type in keyof As]: ActionDispatcher<S, As[type]>
}

/**
 * A [Reducer](https://redux.js.org/basics/reducers) that never needs to
 * determine whether the parameter `state` is `undefined`
 */
export interface NaiveReducer<S, A extends Action.Any> {
  (state: S, action: A): S
}

/**
 * A [[NaiveReducer]] that only needs to process the corresponding [[Action]]
 */
export type CaseReducer<S, A extends Action.Any> = NaiveReducer<S, A>
export namespace CaseReducer {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  export const id = <S>(s: S, action: Action.Empty): S => s
}
export type CaseReducerMap<S> = {
  [type: string]: CaseReducer<S, Action.Any>
}

export interface ReducerBuilder {
  when: ReducerBuilder.When
}
export namespace ReducerBuilder {
  export type ActionMatcher = (action: Action.Any) => boolean

  export type Reducer<A extends Action.Any = Action.Any> = (
    state: RootState,
    action: A,
  ) => RootState

  export interface When {
    <A extends Action.Any = Action.Any>(reducer: Reducer<A>): void
    <A extends Action.Any = Action.Any>(
      actionFilter: ActionMatcher,
      reducer: Reducer<A>,
    ): void
    <A extends Action.Any = Action.Any>(
      actionDispatcher: ActionDispatcher.Any<any, A>,
      reducer: Reducer<A>,
    ): void
  }
}

export interface ActionListener<S = any> {
  <A extends Action.Any = Action.Any>(
    listener: ActionListener.ListenHandler,
  ): () => void
  <A extends Action.Any = Action.Any>(
    actionFilter: ActionListener.ListenMatcher,
    listener: ActionListener.ListenHandler,
  ): () => void
  <A extends Action.Any = Action.Any>(
    actionDispatcher: ActionDispatcher.Any<S, A>,
    listener: ActionListener.ListenHandler,
  ): () => void
}
export namespace ActionListener {
  /* @hidden */
  export type ListenMatcher = (action: Action.Any) => boolean

  /* @hidden */
  export type ListenHandler = (action: Action.Any) => any

  /* @hidden */
  export const dispatchArgs = (
    dispatcher:
      | ActionDispatcher.Any
      | ActionListener.ListenMatcher
      | ActionListener.ListenHandler,
    callback: ActionListener.ListenHandler | undefined,
  ): {
    matcher: ActionListener.ListenMatcher | null
    handler: ActionListener.ListenHandler
  } => {
    let matcher: ActionListener.ListenMatcher | null
    let handler: ActionListener.ListenHandler

    if (!callback) {
      matcher = null
      handler = dispatcher
    } else {
      matcher = (a) => {
        if (ActionDispatcher.isActionDispatcher(dispatcher)) {
          return dispatcher.match(a)
        } else {
          return dispatcher(a)
        }
      }
      handler = callback!
    }

    return { matcher, handler }
  }
}
