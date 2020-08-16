[@c4/e](../README.md) › [Globals](../globals.md) › ["AlertError"](_alerterror_.md)

# Module: "AlertError"

## Index

### Classes

- [AlertError](../classes/_alerterror_.alerterror.md)

### Interfaces

- [AlertableError](../interfaces/_alerterror_.alertableerror.md)

### Functions

- [isAlertableError](_alerterror_.md#isalertableerror)

## Functions

### isAlertableError

▸ **isAlertableError**(`e`: any): _e is AlertableError_

_Defined in [packages/E/src/AlertError.ts:38](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/AlertError.ts#L38)_

判断 Error 是否匹配 AlertableError 接口

在顶层处理 Error 时，尽量使用 isAlertableError 而不是 instanceof AlertError
作为判断方式，因为当前代码可能和其他我们自己写的库使用的 @c4/e 版本不同，会
导致出现多个 AlertError 构造函数，这个时候 instanceof 就不总是生效了

**Parameters:**

| Name | Type |
| ---- | ---- |
| `e`  | any  |

**Returns:** _e is AlertableError_
