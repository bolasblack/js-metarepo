import 'console-testing-library'
import { sliceSpec, Slice, registerSlice } from './Slice'
import { createRoot, Root, internalStateSym } from './Root'
import { Action, CaseReducer } from './types'
import { expectType } from './specUtils'

describe('sliceSpec', () => {
  it('return spec directly', () => {
    const fakeSpec = Symbol('fakeSpec')
    expect(sliceSpec(fakeSpec as any)).toBe(fakeSpec)
  })

  it('check and infer spec type', () => {
    type State = { test: number }

    const spec = sliceSpec({
      initialState: { test: 1 },
      reducers: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
        a(s, a: Action.Empty) {
          expectType<State>(s)
          return s
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
        b(s, a: Action.Payload<number>) {
          expectType<State>(s)
          return s
        },
      },
    })

    expectType<State>(spec.initialState)
    expectType<{
      a: (s: State, a: Action.Empty) => State
      b: (s: State, a: Action.Payload<number>) => State
    }>(spec.reducers)
  })
})

describe('registerSlice', () => {
  let root: Root

  beforeEach(() => {
    root = createRoot()
  })

  it('create a Slice', () => {
    const slice = registerSlice(root, 'test', {
      initialState: Symbol('initial'),
      reducers: {
        set(s, a: Action.Payload<symbol>) {
          return a.payload
        },
      },
    })

    expect(slice).toEqual(
      expect.objectContaining({
        actions: { set: expect.any(Function) },
        reducer: expect.any(Function),
        listen: expect.any(Function),
        subscribe: expect.any(Function),
        getState: expect.any(Function),
        unregister: expect.any(Function),
        unregistered: expect.any(Boolean),
      }),
    )
  })

  describe('argument extra', () => {
    it('works', () => {
      let extraArgSlice: Slice<any, any> | null = null

      const slice1InitialState = Symbol('slice1 init')
      const slice1UpdatedState = Symbol('slice1 updated')
      const slice1 = registerSlice(root, '1', {
        initialState: slice1InitialState,
        reducers: {
          set(s, a: Action.Payload<symbol>) {
            return a.payload
          },
        },
      })

      const slice2 = registerSlice(
        root,
        '2',
        {
          initialState: {
            prevSlice1State: slice1.getState(),
            prevSlice1State$set: null as any,
          },
          reducers: { init: CaseReducer.id },
        },
        (builder, slice) => {
          extraArgSlice = slice

          builder.when((rs) =>
            slice.setState(
              {
                ...slice.getState(rs),
                prevSlice1State: slice1.getState(rs),
              },
              rs,
            ),
          )

          builder.when(slice1.actions.set, (rs, a) =>
            slice.setState(
              {
                ...slice.getState(rs),
                prevSlice1State$set: a.payload,
              },
              rs,
            ),
          )
        },
      )

      expect(extraArgSlice).toBe(slice2)
      expect(slice2.getState()).toEqual({
        prevSlice1State: slice1InitialState,
        prevSlice1State$set: null,
      })

      slice1.actions.set(slice1UpdatedState)
      expect(slice2.getState()).toEqual({
        prevSlice1State: slice1InitialState,
        prevSlice1State$set: slice1UpdatedState,
      })
    })
  })
})

describe('Slice', () => {
  let root: Root
  let slice: Slice<symbol, { set: Action.Payload<symbol> }>
  const sliceName = 'test' as const
  const initialState = Symbol('initial')
  const updatedState = Symbol('updated')

  beforeEach(() => {
    root = createRoot()

    slice = registerSlice(root, sliceName, {
      initialState,
      reducers: {
        set(s, a: Action.Payload<symbol>) {
          return a.payload
        },
      },
    })
  })

  describe('actions', () => {
    it('can generate right type', () => {
      const root = createRoot()

      const slice = registerSlice(root, sliceName, {
        initialState,
        reducers: {
          set(s, a: Action.Payload<symbol>) {
            return a.payload
          },
        },
      })

      expectType<(payload: symbol) => void>(slice.actions.set)
      expectType<void>(slice.actions.set(updatedState))
      expectType<{ type: 'test/set'; payload: symbol }>(
        slice.actions.set.create(updatedState),
      )
    })

    it('can dispatch self action', () => {
      root.dispatch = jest.fn(root.dispatch)

      slice.actions.set(updatedState)

      expect(root.dispatch).toBeCalledWith({
        type: `${sliceName}/set`,
        payload: updatedState,
      })

      expect(root.getState()).toEqual({
        [internalStateSym]: {
          [sliceName]: updatedState,
        },
      })
    })
  })

  describe('reducer', () => {
    it('works', () => {
      expect(root.getState()).toEqual({ [internalStateSym]: {} })

      const anotherSym = Symbol('updated2')
      const newState = slice.reducer(root.getState(), {
        type: `${sliceName}/set`,
        payload: anotherSym,
      })
      expect(newState).toEqual({
        [internalStateSym]: { [sliceName]: anotherSym },
      })

      expect(root.getState()).toEqual({ [internalStateSym]: {} })
    })
  })

  describe('listen', () => {
    it('listen self actions by default', () => {
      const listener = jest.fn()
      const helloAction = { type: 'hello' }
      slice.listen(listener)

      root.dispatch(helloAction)
      expect(listener).not.toBeCalledWith(helloAction)

      slice.actions.set(updatedState)
      expect(listener).toBeCalledWith({
        type: slice.actions.set.toString(),
        payload: updatedState,
      })
    })
  })

  describe('subscribe', () => {
    it('callback when any action dispatched in parent', () => {
      const listener = jest.fn()
      const helloAction = { type: 'hello' }
      slice.subscribe(listener)

      root.dispatch(helloAction)
      expect(listener).lastCalledWith()
      expect(listener).toBeCalledTimes(1)

      slice.actions.set(updatedState)
      expect(listener).lastCalledWith()
      expect(listener).toBeCalledTimes(2)
    })
  })

  describe('getState', () => {
    it('works', () => {
      expect(root.getState()).toEqual({ [internalStateSym]: {} })
      expect(slice.getState()).toEqual(initialState)
      slice.actions.set(updatedState)
      expect(root.getState()).toEqual({
        [internalStateSym]: { [sliceName]: updatedState },
      })
      expect(slice.getState()).toEqual(updatedState)

      const anotherSym = Symbol('fake state')
      expect(slice.getState({ [internalStateSym]: {} })).toEqual(initialState)
      expect(
        slice.getState({ [internalStateSym]: { [sliceName]: anotherSym } }),
      ).toEqual(anotherSym)
    })
  })

  describe('setState', () => {
    it('works', () => {
      expect(slice.setState(updatedState, { [internalStateSym]: {} })).toEqual({
        [internalStateSym]: { [sliceName]: updatedState },
      })
    })

    it('receive a setter function as first argument', () => {
      expect(
        slice.setState(() => updatedState, { [internalStateSym]: {} }),
      ).toEqual({
        [internalStateSym]: { [sliceName]: updatedState },
      })
    })

    it('is a curried function', () => {
      expect(slice.setState(updatedState)).toEqual(expect.any(Function))
      expect(slice.setState(updatedState)({ [internalStateSym]: {} })).toEqual({
        [internalStateSym]: { [sliceName]: updatedState },
      })

      expect(slice.setState(() => updatedState)).toEqual(expect.any(Function))
      expect(
        slice.setState(() => updatedState)({ [internalStateSym]: {} }),
      ).toEqual({
        [internalStateSym]: { [sliceName]: updatedState },
      })
    })
  })

  describe('unregister', () => {
    it('should console error when calling `getState` after unregistered', () => {
      slice.unregister()
      slice.getState()
      slice.getState({ [internalStateSym]: { [sliceName]: 1 } })
      expect(console.error).toMatchSnapshot()
    })

    it('should console error when calling `setState` after unregistered', () => {
      slice.unregister()
      slice.setState(initialState, { [internalStateSym]: { [sliceName]: 1 } })
      expect(console.error).toMatchSnapshot()
    })

    it('should console error when calling `subscribe` after unregistered', () => {
      slice.unregister()
      slice.subscribe(console.log)
      expect(console.error).toMatchSnapshot()
    })

    it('should console error when calling `listen` after unregistered', () => {
      slice.unregister()
      slice.listen(console.log)
      slice.listen(slice.actions.set, console.log)
      expect(console.error).toMatchSnapshot()
    })

    it('should console error when calling action dispatcher after unregistered', () => {
      slice.unregister()
      slice.actions.set(updatedState)
      expect(console.error).toMatchSnapshot()
    })

    it('should console error when calling `reducer` after unregistered', () => {
      slice.unregister()
      slice.reducer(
        { [internalStateSym]: {} },
        slice.actions.set.create(initialState),
      )
      slice.actions.set(updatedState)
      expect(console.error).toMatchSnapshot()
    })

    it('should unregister slice reducer in parent', () => {
      slice.unregister()
      slice.actions.set(updatedState)
      expect(root.getState()).toEqual({ [internalStateSym]: {} })
    })
  })

  describe('unregistered', () => {
    it('works', () => {
      expect(slice.unregistered).toBe(false)
      slice.unregister()
      expect(slice.unregistered).toBe(true)
    })
  })
})
