import { renderHook, act } from '@testing-library/react-hooks'
import * as React from 'react'
import { useState } from 'react'
import { createRoot, Root } from './Root'
import { Slice, registerSlice, sliceSpec } from './Slice'
import { Action } from './types'
import { useSlice, createUseSelector, createUseEffect } from './react'

describe('useSlice', () => {
  let root: Root
  const spec = sliceSpec({
    initialState: 'initial',
    reducers: {
      set(s, a: Action.Payload<string>) {
        return a.payload
      },
    },
  })

  beforeEach(() => {
    root = createRoot()
  })

  describe('Slice as argument', () => {
    const sliceName = 'test' as const
    let slice: Slice.FromSpec<string, typeof spec>

    beforeEach(() => {
      slice = registerSlice(root, sliceName, spec)
    })

    it('works', () => {
      const { result } = renderHook(() => useSlice(slice))
      expect(result.current).toEqual({
        actions: { set: expect.any(Function) },
        useSelector: expect.any(Function),
        useEffect: expect.any(Function),
      })
    })

    it('change returned when Slice changed', () => {
      const { result, rerender } = renderHook(() => useSlice(slice))
      const initialRet = result.current

      rerender()
      expect(result.current).toBe(initialRet)

      slice = registerSlice(root, 'test1', spec)

      rerender()
      expect(result.current).not.toBe(initialRet)
    })
  })

  describe('SliceSpec as argument', () => {
    it('works', () => {
      const { result } = renderHook(() => useSlice(root, 'test', spec))
      expect(result.current).toEqual({
        actions: { set: expect.any(Function) },
        useSelector: expect.any(Function),
        useEffect: expect.any(Function),
      })
    })

    it('change returned when any argument changed', () => {
      let root = createRoot()
      let sliceName = 'test'
      let _spec = spec

      const { result, rerender } = renderHook(() =>
        useSlice(root, sliceName, _spec),
      )
      let prevRet = result.current

      rerender()
      expect(result.current).toBe(prevRet)

      root = createRoot()
      rerender()
      expect(result.current).not.toBe(prevRet)
      prevRet = result.current

      sliceName = sliceName + '1'
      rerender()
      expect(result.current).not.toBe(prevRet)
      prevRet = result.current

      _spec = { ..._spec }
      rerender()
      expect(result.current).not.toBe(prevRet)
      prevRet = result.current
    })
  })
})

describe('useSelector', () => {
  const sliceName = 'test' as const
  const initialState = Symbol('initial')
  const updatedState = Symbol('updated')
  const spec = sliceSpec({
    initialState,
    reducers: {
      set(s, a: Action.Payload<symbol>) {
        return a.payload
      },
    },
  })
  let root: Root
  let slice: Slice.FromSpec<typeof sliceName, typeof spec>
  let useSelector: useSlice.UseSelector<symbol>

  beforeEach(() => {
    root = createRoot()

    slice = registerSlice(root, sliceName, spec)

    useSelector = createUseSelector(slice)
  })

  describe('with no argument', () => {
    it('return slice state', () => {
      const { result } = renderHook(() => useSelector())
      expect(result.current).toBe(initialState)

      void act(() => {
        slice.actions.set(updatedState)
      })
      expect(result.current).toBe(updatedState)
    })
  })

  describe('with arguments', () => {
    it('return selected result', () => {
      const { result } = renderHook(() => useSelector(s => String(s)))
      expect(result.current).toBe('Symbol(initial)')

      void act(() => {
        slice.actions.set(updatedState)
      })
      expect(result.current).toBe('Symbol(updated)')
    })

    it('receive deps as second argument', () => {
      const { result } = renderHook(() => {
        const [prefix, updatePrefix] = useState('!')
        return {
          updatePrefix,
          res: useSelector(s => prefix + String(s), [prefix]),
        }
      })
      expect(result.current.res).toBe('!Symbol(initial)')

      void act(() => {
        result.current.updatePrefix('?')
      })
      expect(result.current.res).toBe('?Symbol(initial)')
    })
  })

  it('will not re-render component if action dispatched but state not changed', () => {
    const hookFn1 = jest.fn(() => useSelector())
    renderHook(hookFn1)
    const hookFn2 = jest.fn(() => useSelector(String))
    renderHook(hookFn2)
    const hookFn3 = jest.fn(() => {
      const [prefix, updatePrefix] = useState('!')
      return {
        updatePrefix,
        res: useSelector(s => prefix + String(s), [prefix]),
      }
    })
    const { result: hookFn3Res } = renderHook(hookFn3)

    expect(hookFn1).toBeCalledTimes(1)
    expect(hookFn2).toBeCalledTimes(1)
    expect(hookFn3).toBeCalledTimes(1)

    void act(() => {
      slice.actions.set(initialState)
    })
    expect(hookFn1).toBeCalledTimes(1)
    expect(hookFn2).toBeCalledTimes(1)
    expect(hookFn3).toBeCalledTimes(1)

    void act(() => {
      slice.actions.set(updatedState)
    })
    expect(hookFn1).toBeCalledTimes(2)
    expect(hookFn2).toBeCalledTimes(2)
    expect(hookFn3).toBeCalledTimes(2)

    void act(() => {
      hookFn3Res.current.updatePrefix('!')
    })
    expect(hookFn1).toBeCalledTimes(2)
    expect(hookFn2).toBeCalledTimes(2)
    expect(hookFn3).toBeCalledTimes(3)
  })
})

describe('useEffect', () => {
  const spec = sliceSpec({
    initialState: '0',
    reducers: {
      set(s, a: Action.Payload<string>) {
        return a.payload
      },
    },
  })
  const sliceName = 'test' as const
  let root: Root
  let slice: Slice.FromSpec<typeof sliceName, typeof spec>
  let useEffect: useSlice.UseEffect
  let listener: (action: any) => void
  let matcher: (action: any) => boolean

  beforeEach(() => {
    root = createRoot()

    slice = registerSlice(root, sliceName, spec)

    useEffect = createUseEffect(slice)
  })

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(React as any).useEffect = jest.fn(React.useEffect)
    listener = jest.fn()
    matcher = jest.fn(() => true)
    slice.listen = jest.fn(slice.listen) as any
  })

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(React as any).useEffect = (React.useEffect as any).getMockImplementation()
  })

  it('support arguments: listener', () => {
    renderHook(() => useEffect(listener))
    expect(slice.listen).toBeCalledWith(listener)
    expect(React.useEffect).toBeCalledWith(expect.any(Function), undefined)
  })

  it('support arguments: listener, deps', () => {
    renderHook(() => useEffect(listener, ['a']))
    expect(slice.listen).toBeCalledWith(listener)
    expect(React.useEffect).toBeCalledWith(expect.any(Function), ['a'])
  })

  it('support arguments: dispatcher, listener', () => {
    renderHook(() => useEffect(slice.actions.set, listener))
    expect(slice.listen).toBeCalledWith(slice.actions.set.match, listener)
    expect(React.useEffect).toBeCalledWith(expect.any(Function), undefined)
  })

  it('support arguments: dispatcher, listener, deps', () => {
    renderHook(() => useEffect(slice.actions.set, listener, ['a']))
    expect(slice.listen).toBeCalledWith(slice.actions.set.match, listener)
    expect(React.useEffect).toBeCalledWith(expect.any(Function), ['a'])
  })

  it('support arguments: matcher, listener', () => {
    renderHook(() => useEffect(matcher, listener))
    expect(slice.listen).toBeCalledWith(matcher, listener)
    expect(React.useEffect).toBeCalledWith(expect.any(Function), undefined)
  })

  it('support arguments: dispatcher, listener, deps', () => {
    renderHook(() => useEffect(matcher, listener, ['a']))
    expect(slice.listen).toBeCalledWith(matcher, listener)
    expect(React.useEffect).toBeCalledWith(expect.any(Function), ['a'])
  })
})
