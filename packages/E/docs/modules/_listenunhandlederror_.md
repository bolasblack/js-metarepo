[@c4/e](../README.md) › [Globals](../globals.md) › ["listenUnhandledError"](_listenunhandlederror_.md)

# Module: "listenUnhandledError"

## Index

### Functions

- [listenUnhandledError](_listenunhandlederror_.md#listenunhandlederror)

## Functions

### listenUnhandledError

▸ **listenUnhandledError**‹**T**›(`errorHandler`: function): _function_

_Defined in [packages/E/src/listenUnhandledError.ts:10](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/listenUnhandledError.ts#L10)_

在顶层注册所有未处理的错误（支持浏览器/WebWorker/node.js）

在 Chrome 里，非当前域名下的 js 脚本抛错时，ErrorEvent#error 会是 null，为了
确保 errorHandler 始终能够得到一些错误信息（也是为了能让 isErrorShown 依旧能
生效），所以我们会传入一个 ErrorEvent

PS. 其实这个问题可以通过给 `<script>` 标签添加 `crossorigin` 属性来解决

**Type parameters:**

▪ **T**

**Parameters:**

▪ **errorHandler**: _function_

▸ (`err`: T | ErrorEvent): _any_

**Parameters:**

| Name  | Type                |
| ----- | ------------------- |
| `err` | T &#124; ErrorEvent |

**Returns:** _function_

▸ (): _void_
