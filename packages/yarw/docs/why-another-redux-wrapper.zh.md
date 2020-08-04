# 为什么又写一个 redux 包装

## 原因

- redux-toolkit 做了一个很好的尝试，我只是觉得它该做的做的不够多，没必要的又做的太多了：
  - 没必要默认引入 immer
  - 没必要默认有 `createEntityAdapter` 方案
  - 默认的 `actions` 是 actionCreator 而不是 actionDispatcher
  - 对代码分割不够友好，因为还是需要自己去把 Slice 的 `reducer` 传给 `createStore`
  - 具体使用的时候，需要 import 的东西还是很多。理想的情况应该是，一旦我创建好一个 Slice ，那么我应该只需要这个 Slice 提供的 API 就可以完成绝大部分操作，不需要 store，也不需要关心自己或者其他 Slice 的 state 在整个 state 中的位置什么的
- sukkula 和 Pure-Model 的思路很好，和我绝大部分需求不谋而合，它的问题比较少：
  - Pure-Model 没有开源
  - sukkula 需要 rxjs（没必要默认引入）
  - sukkula 没有 TypeScript 支持
  - sukkula 要么是有多个 store ，要么是没关心代码分割的事情？
  - sukkula 和 Pure-Model 不鼓励使用具体的 action 来驱动 effect ，比如不是通过 dispatch 一个 action ，然后代码在某个地方听到这个 action 之后再去运行副作用，而是直接调用一个副作用函数，这个函数的调用不会在 action 列表里出现，我不喜欢这个设计，我觉得所有外部干涉也都映射为一个 action ，这样也会更容易 debug
  - sukkula 和 Pure-Model 似乎觉得自己本身就是 Model ，我是觉得在它之外还需要一个领域知识层，大部分操作 Entity 的代码，以及一些脱离了具体界面上下文的代码（比如权限操作什么的）还是应该写在那边。虽然目前看起来我们两者的 API 非常相似，但是我觉得出发点不同，将来还是可能会有分歧
- recoiljs 的想法也很好，对代码分割非常友好。只是它目前看起来会和 React 进行非常深度的绑定，而我希望这个库是和平台无关的，这样业务知识才有可能在各个框架之间进行转移。比如脱离了 React 之后它似乎没办法自己管理副作用。

## 我想要的

- 解决掉上面提到的那些问题
- 代码拆分友好
  - 就是说要能把 Store 里的代码方便地拆分到各个模块里去，按需加载。
- TypeScript 友好
  - 类型安全
  - 不需要为了用 TypeScript 还得写更多样板代码
- 减少 Redux 的样板代码
  - 比如减少写 action creator
  - 减少写 type
  - 减少写 import 各种 constants/actionCreator
- 对扩展开放
  - 不影响 Redux 原本的扩展能力
  - 支持调整 Slice 的部分行为（比如可以通过扩展给 reducer 包上 immer）
