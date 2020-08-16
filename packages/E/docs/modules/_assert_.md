[@c4/e](../README.md) › [Globals](../globals.md) › ["assert"](_assert_.md)

# Module: "assert"

## Index

### Classes

- [AssertionError](../classes/_assert_.assertionerror.md)

### Functions

- [assert](_assert_.md#assert)

## Functions

### assert

▸ **assert**(`assertion`: boolean | function, `msg?`: undefined | string): _asserts assertion_

_Defined in [packages/E/src/assert.ts:14](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/assert.ts#L14)_

判断 `assertion` 是否为真，如果不是，则抛出 `message` 为 `msg` 的
异常 [AssertionError](../classes/_assert_.assertionerror.md)

`assertion` 支持函数

**Parameters:**

| Name        | Type                    |
| ----------- | ----------------------- |
| `assertion` | boolean &#124; function |
| `msg?`      | undefined &#124; string |

**Returns:** _asserts assertion_
