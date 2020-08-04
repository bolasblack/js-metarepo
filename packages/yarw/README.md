# YARW

A redux wrapper inspired by many ideas:

- [`docs/为什么要写一个 Redux Wrapper` (chinese)](https://github.com/bolasblack/js-metarepo/blob/master/packages/yarw/docs/why-write-another-redux-wrapper.zh.md)
- https://github.com/Lucifier129/sukkula
- https://mp.weixin.qq.com/s/g4hnfirDmyeuXAdEt-zk9w
- https://redux-toolkit.js.org/
- https://recoiljs.org/

## Feature

* Type safety
  * Never losing type information downstream through all the layers of your application (e.g. no type assertions or hacking with `any` type)
* Less boilerplate code
  * Generate action creator/dispatcher automatically
* Code splitting friendly
  * Add reducer at any time in your application lifecycle
* Still redux
  * So you can still use most of your favorite redux middlewares/tools

## Usage

```typescript
import { createRoot, registerSlice } from 'yarw'

// Create a `Root` that like be the `store` of redux
const root = createRoot()

// You can dynamically register a `Slice` at any time
setTimeout(() => {
  const slice = registerSlice(root, 'sliceName', {
    initialState: { count: 0 },
    reducers: {
      doSomething(state, action: Action.Payload<number>) {
        return { ...state, count: state.count + action.payload }
      },
    },
  })

  // Action, actionCreator and actionDispatcher has been created automatically
  slice.doSomething(100)
  
  // Let's print the count
  console.log('current count', slice.getState(root).count)
  
  // You can even unregister slice when you no need, then the reducer will no
  // longer work
  setTimeout(() => slice.unregister(), Math.randaom() * 1000)
}, Math.random() * 1000)
```

More usage please read [`docs/example.ts`](https://github.com/bolasblack/js-metarepo/blob/master/packages/yarw/docs/example.ts)
