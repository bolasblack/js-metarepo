import $$observable from 'symbol-observable'
import { createRoot, RootState, Root } from './Root'
import { Action, NaiveReducer, ActionDispatcher } from './types'

describe('createRoot', () => {
  it('should works', () => {
    const root = createRoot()
    expect(root).toEqual(
      expect.objectContaining({
        dispatch: expect.any(Function),
        subscribe: expect.any(Function),
        listen: expect.any(Function),
        getState: expect.any(Function),
        registerReducer: expect.any(Function),
        [$$observable]: expect.any(Function),
      }),
    )
  })
})

describe('Root', () => {
  describe('registerReducer', () => {
    let root: Root
    let reducer: NaiveReducer<RootState, Action.Any>
    let prevState: RootState
    const replaceActionTypeMatcher = expect.stringMatching(/^@@redux\/REPLACE/)

    beforeEach(() => {
      reducer = jest.fn((s: RootState, a: Action.Any) => ({
        ...s,
        lastAction: a,
      }))

      root = createRoot()

      prevState = root.getState()
    })

    it('can register reducer', () => {
      root.registerReducer(reducer)
      expect(reducer).lastCalledWith(prevState, {
        type: replaceActionTypeMatcher,
      })
      expect(root.getState()).toEqual({
        ...prevState,
        lastAction: { type: replaceActionTypeMatcher },
      })

      prevState = root.getState()
      root.dispatch({ type: 'hello' })
      expect(reducer).lastCalledWith(prevState, { type: 'hello' })
      expect(root.getState()).toEqual({
        ...prevState,
        lastAction: { type: 'hello' },
      })
    })

    it('can unregister reducer', () => {
      const unregister = root.registerReducer(reducer)
      unregister()

      root.dispatch({ type: 'hello' })
      expect(reducer).toBeCalledTimes(1)
      expect(reducer).toBeCalledWith(prevState, {
        type: replaceActionTypeMatcher,
      })
      expect(root.getState()).toEqual({
        ...prevState,
        lastAction: { type: replaceActionTypeMatcher },
      })
    })
  })

  describe('listen', () => {
    let root: Root

    beforeEach(() => {
      root = createRoot()
    })

    it('listen all actions', () => {
      const listener = jest.fn()
      const action = { type: Symbol('hello') }

      root.listen(listener)
      root.dispatch(action)
      expect(listener).toBeCalledWith(action)
    })

    it('return a unlisten function', () => {
      const listener = jest.fn()
      const action1 = { type: 'hello1' }
      const action2 = { type: 'hello2' }
      const unlistener = root.listen(listener)

      root.dispatch(action1)
      expect(listener).toBeCalledWith(action1)
      expect(listener).toBeCalledTimes(1)

      unlistener()

      root.dispatch(action2)
      expect(listener).not.toBeCalledWith(action2)
      expect(listener).toBeCalledTimes(1)
    })

    it('can filter action by ActionDispatcher', () => {
      const listener = jest.fn()
      const dispatcher = ActionDispatcher.create<any, Action<'hello1'>>(
        'hello1',
        root,
      )
      const action1 = { type: 'hello1' }
      const action2 = { type: 'hello2' }
      root.listen(dispatcher, listener)

      root.dispatch(action1)
      root.dispatch(action2)
      expect(listener).toBeCalledWith(action1)
      expect(listener).not.toBeCalledWith(action2)
      expect(listener).toBeCalledTimes(1)
    })
  })
})
