[@c4/e](../README.md) › [Globals](../globals.md) › ["assert"](../modules/_assert_.md) › [AssertionError](_assert_.assertionerror.md)

# Class: AssertionError ‹**InnerError**›

[assert](../modules/_assert_.md#assert) 函数抛出的异常

## Type parameters

▪ **InnerError**: _[Error](_baseerror_.baseerror.md#static-error)_

## Hierarchy

↳ [BaseError](_baseerror_.baseerror.md)

↳ **AssertionError**

## Index

### Constructors

- [constructor](_assert_.assertionerror.md#constructor)

### Properties

- [innerError](_assert_.assertionerror.md#optional-innererror)
- [message](_assert_.assertionerror.md#message)
- [name](_assert_.assertionerror.md#name)
- [stack](_assert_.assertionerror.md#optional-stack)

## Constructors

### constructor

\+ **new AssertionError**(`message?`: undefined | string): _[AssertionError](_assert_.assertionerror.md)_

_Inherited from [BaseError](_baseerror_.baseerror.md).[constructor](_baseerror_.baseerror.md#constructor)_

_Defined in [packages/E/src/BaseError.ts:18](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/BaseError.ts#L18)_

**Parameters:**

| Name       | Type                    |
| ---------- | ----------------------- |
| `message?` | undefined &#124; string |

**Returns:** _[AssertionError](_assert_.assertionerror.md)_

## Properties

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
