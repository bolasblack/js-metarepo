[@c4/e](../README.md) › [Globals](../globals.md) › ["AlertError"](../modules/_alerterror_.md) › [AlertError](_alerterror_.alerterror.md)

# Class: AlertError ‹**InnerError**›

这个 AlertError 作为 AlertableError 增强版，并且和 BaseError 有很好的结合，
我们内部绝大部分需要提示的地方都应该直接使用 AlertError 而不是自己构造一个符
合 AlertableError 接口的 Error 实例

## Type parameters

▪ **InnerError**: _[Error](_baseerror_.baseerror.md#static-error)_

## Hierarchy

↳ [BaseError](_baseerror_.baseerror.md)‹InnerError›

↳ **AlertError**

## Implements

- [AlertableError](../interfaces/_alerterror_.alertableerror.md)

## Index

### Constructors

- [constructor](_alerterror_.alerterror.md#constructor)

### Properties

- [displayMessage](_alerterror_.alerterror.md#displaymessage)
- [innerError](_alerterror_.alerterror.md#optional-innererror)
- [message](_alerterror_.alerterror.md#message)
- [name](_alerterror_.alerterror.md#name)
- [stack](_alerterror_.alerterror.md#optional-stack)

### Methods

- [wrap](_alerterror_.alerterror.md#static-wrap)

## Constructors

### constructor

\+ **new AlertError**(`displayMessage`: string, ...`rest`: ErrParamaters): _[AlertError](_alerterror_.alerterror.md)_

_Overrides [BaseError](_baseerror_.baseerror.md).[constructor](_baseerror_.baseerror.md#constructor)_

_Defined in [packages/E/src/AlertError.ts:57](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/AlertError.ts#L57)_

**Parameters:**

| Name             | Type          |
| ---------------- | ------------- |
| `displayMessage` | string        |
| `...rest`        | ErrParamaters |

**Returns:** _[AlertError](_alerterror_.alerterror.md)_

\+ **new AlertError**(`displayMessage`: string, `innerError`: InnerError, ...`rest`: ErrParamaters): _[AlertError](_alerterror_.alerterror.md)_

_Overrides [BaseError](_baseerror_.baseerror.md).[constructor](_baseerror_.baseerror.md#constructor)_

_Defined in [packages/E/src/AlertError.ts:59](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/AlertError.ts#L59)_

**Parameters:**

| Name             | Type          |
| ---------------- | ------------- |
| `displayMessage` | string        |
| `innerError`     | InnerError    |
| `...rest`        | ErrParamaters |

**Returns:** _[AlertError](_alerterror_.alerterror.md)_

## Properties

### displayMessage

• **displayMessage**: _string_

_Implementation of [AlertableError](../interfaces/_alerterror_.alertableerror.md).[displayMessage](../interfaces/_alerterror_.alertableerror.md#displaymessage)_

_Defined in [packages/E/src/AlertError.ts:50](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/AlertError.ts#L50)_

---

### `Optional` innerError

• **innerError**? : _InnerError_

_Inherited from [AlertError](_alerterror_.alerterror.md).[innerError](_alerterror_.alerterror.md#optional-innererror)_

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

## Methods

### `Static` wrap

▸ **wrap**‹**InnerError**›(`innerError`: InnerError, `displayMessage`: string): _[AlertError](_alerterror_.alerterror.md)‹InnerError›_

_Defined in [packages/E/src/AlertError.ts:52](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/AlertError.ts#L52)_

**Type parameters:**

▪ **InnerError**: _[Error](_baseerror_.baseerror.md#static-error)_

**Parameters:**

| Name             | Type       |
| ---------------- | ---------- |
| `innerError`     | InnerError |
| `displayMessage` | string     |

**Returns:** _[AlertError](_alerterror_.alerterror.md)‹InnerError›_
