/* eslint-disable @typescript-eslint/no-unused-vars-experimental, @typescript-eslint/no-empty-function */

import * as React from 'react'
import { createRoot, registerSlice, Action, CaseReducer, Slice } from '../src'
import { useSlice } from '../src/react'

// 参考 redux 的 createStore ，参数只有 middlewares ，返回的 Root 和 Store 基本
// 兼容，除了没有 replaceReducer 以外
// 如果将来要支持用户自己传 preloadState 什么的，我们可以加一个 middleware 用来
// 检查有些 reducer 是不是把这个 Symbol 删掉了，如果有的话就直接抛出异常
const root = createRoot()

// 第一个参数是 root ，用来把这个 slice 注册到对应的 root 上
// 第二个参数是 slice 的命名空间，slice 的 state 和 action 都会在这个命名空间下
// 第三个参数是 slice 的 Spec ，是可以复用的
// 第四个参数目前简单称之为 extra ，是一个函数，是可选的
//
// extra 函数的第一个参数是 ReducerBuilder，用于在即将创建的 slice 里对其他
// slice 的 action 作出一些处理
// extra 函数的第二个参数就是即将创建的 slice 本身，可以用来获取 RootState 里当
// 前 slice 的 state，listen 任意 slice 的 action，在将来任意时间触发任意 slice
// 的副作用
// 注意：在 extra 被执行的时候，当前正在创建的 slice 的 reducer 和 listener 可能
// 还没有准备完毕，所以在此时 dispatch 任何 slice 自己 action 上都不保证会有效果
//
// 每个 slice 可以在程序生命周期的任何时机注册到 store 里，便于分割代码
//
// 而且将来或许可以个把第一个参数从 store 变成 Slice ，这样 Spec 就可以复用到更
// 细的粒度了，比如 AsyncSlice 什么的
const appSlice = registerSlice(
  root,
  'app',
  {
    initialState: <appSlice.AppContext>{},
    reducers: {
      fetch: CaseReducer.id,
      fetched(s, action: Action.Payload<appSlice.AppContext>) {
        return action.payload
      },
    },
  },
  (builder, slice) => {
    slice.listen(slice.actions.fetch, async () => {
      const resp = await fetch('/context')
      appSlice.actions.fetched(await resp.json())
    })
    setTimeout(() => {
      slice.actions.fetch()
    })
  },
)
namespace appSlice {
  export interface AppContext {
    username?: string
  }
}

// 可以在 Slice 里处理其他 Slice 的 action
const ctxHistorySlice = registerSlice(
  root,
  'ctxHistory',
  {
    initialState: {
      appStateHistories: [] as Slice.StateType<typeof appSlice>[],
    },
    reducers: {},
  },
  (builder, slice) => {
    builder.when(isAnyAppSliceAction, (rs) =>
      slice.setState((s) => {
        const newHistories = s.appStateHistories.concat(appSlice.getState(rs))
        return { appStateHistories: newHistories }
      }, rs),
    )

    function isAnyAppSliceAction(a: Action.Any): boolean {
      return Object.values(appSlice.actions).some((ad) => ad.match(a))
    }
  },
)

// Slice 既支持作为一个单独的模型进行定义，也可以在组件文件里进行注册，编写某些
// 组件相关的业务逻辑
function useDashboardSlice(): {
  init: () => void
  dashboardMessage: string
} {
  type DashboardData = {
    activityCount: number
  }

  const viewSlice = useSlice(root, 'DashboardComp', {
    initialState: {
      loading: false,
      activityCount: 0,
    },
    reducers: {
      init(s) {
        return { ...s, loading: true }
      },
      inited(s, a: Action.Payload<DashboardData>) {
        return { loading: false, activityCount: a.payload.activityCount }
      },
    },
  })

  const appViewSlice = useSlice(appSlice)

  const username = appViewSlice.useSelector((s) => s.username)
  const dashboardMessage = viewSlice.useSelector(
    (s) =>
      s.loading && username
        ? 'Loading...'
        : `Hello ${username}, you has ${s.activityCount} activities`,
    [username],
  )

  viewSlice.useEffect(
    viewSlice.actions.init,
    async () => {
      const resp = await fetch('/activitySummary')
      viewSlice.actions.inited(await resp.json())
    },
    [],
  )

  return {
    init: viewSlice.actions.init,
    dashboardMessage,
  }
}

export const TestComp: React.FC = () => {
  const { dashboardMessage, init } = useDashboardSlice()

  const { actions: appActions } = useSlice(appSlice)

  React.useEffect(init, [])

  return React.createElement(
    React.Fragment,
    {},
    dashboardMessage,
    React.createElement('button', { onClick: appActions.fetch }, 'refresh'),
  )
}
