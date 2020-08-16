[@c4/e](../README.md) › [Globals](../globals.md) › ["BaseError"](../modules/_baseerror_.md) › [BaseError](_baseerror_.baseerror.md)

# Class: BaseError ‹**InnerError**›

我们系统内部流转的所有 Error 都应该继承自这个 BaseError ，这样子便于我们后续
对内部的 Error 做一些增强，比如目前已经有的 innerError 属性

innerError 主要是用于存储包装之前的 Error 。比如 PostRepository 发起获取某个
Post 的网络请求 404 了，得到一个 NetworkError ，比较好的做法不是直接让这个
Error 直接向上抛，而是包装成一个 NotFoundError ；同时为了能够保留外部获取最底
层错误信息的可能性，我们可以把 NetworkError 赋值给 NotFoundError 的
innerError 属性

上述行为我们已经封装在 [wrapError](../modules/_baseerror_.md#wraperror) 函数内，直接使用就好了

`innerError` 的思路来自 https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#7102-error-condition-responses

## Type parameters

▪ **InnerError**: _[Error](_baseerror_.baseerror.md#static-error)_

## Hierarchy

- [Error](_baseerror_.baseerror.md#static-error)

  ↳ **BaseError**

  ↳ [AlertError](_alerterror_.alerterror.md)

  ↳ [AssertionError](_assert_.assertionerror.md)

## Index

### Constructors

- [constructor](_baseerror_.baseerror.md#constructor)

### Properties

- [innerError](_baseerror_.baseerror.md#optional-innererror)
- [message](_baseerror_.baseerror.md#message)
- [name](_baseerror_.baseerror.md#name)
- [stack](_baseerror_.baseerror.md#optional-stack)
- [Error](_baseerror_.baseerror.md#static-error)

## Constructors

### constructor

\+ **new BaseError**(`message?`: undefined | string): _[BaseError](_baseerror_.baseerror.md)_

_Defined in [packages/E/src/BaseError.ts:18](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/BaseError.ts#L18)_

**Parameters:**

| Name       | Type                    |
| ---------- | ----------------------- |
| `message?` | undefined &#124; string |

**Returns:** _[BaseError](_baseerror_.baseerror.md)_

## Properties

### `Optional` innerError

• **innerError**? : _InnerError_

_Defined in [packages/E/src/BaseError.ts:18](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/BaseError.ts#L18)_

---

### message

• **message**: _string_

_Inherited from [AlertError](_alerterror_.alerterror.md).[message](_alerterror_.alerterror.md#message)_

Defined in node_modules/typescript/lib/lib.es5.d.ts:974

---

### name

• **name**: _string_

_Inherited from [AlertError](_alerterror_.alerterror.md).[name](_alerterror_.alerterror.md#name)_

Defined in node_modules/typescript/lib/lib.es5.d.ts:973

---

### `Optional` stack

• **stack**? : _undefined | string_

_Inherited from [AlertError](_alerterror_.alerterror.md).[stack](_alerterror_.alerterror.md#optional-stack)_

Defined in node_modules/typescript/lib/lib.es5.d.ts:975

---

### `Static` Error

▪ **Error**: _ErrorConstructor_

Defined in node_modules/typescript/lib/lib.es5.d.ts:984
