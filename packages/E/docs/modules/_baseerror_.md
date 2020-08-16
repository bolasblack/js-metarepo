[@c4/e](../README.md) › [Globals](../globals.md) › ["BaseError"](_baseerror_.md)

# Module: "BaseError"

## Index

### Classes

- [BaseError](../classes/_baseerror_.baseerror.md)

### Functions

- [wrapError](_baseerror_.md#wraperror)

## Functions

### wrapError

▸ **wrapError**‹**WrapperError**, **InnerError**, **WrapperErrorConstructor**, **WrapperErrorConstructorParameters**›(`innerError`: InnerError, `wrapperErrorConstructor`: WrapperErrorConstructor, ...`constructArgs`: WrapperErrorConstructorParameters): _WrapperError_

_Defined in [packages/E/src/BaseError.ts:69](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/BaseError.ts#L69)_

用一个新的 Error2 来包装旧的 Error1 ，然后把 Error1 赋值到 Error2.innerError

**`example`**

```ts
const innerError = new TypeError()

const err1 = wrapError(innerError, AlertError, '123', innerError.message) // 如果这么写，err1 的类型是 BaseError<Error>

const err2 = wrapError<AlertError<TypeError>>(
  innerError,
  AlertError,
  '123',
  innerError.message,
) // 我们需要这么写，err2 的类型才是我们预期的 AlertError<TypeError>
```

**Type parameters:**

▪ **WrapperError**: _[BaseError](../classes/_baseerror_.baseerror.md)‹InnerError›_

新的 Error 的类型

▪ **InnerError**: _[Error](../classes/_baseerror_.baseerror.md#static-error)_

▪ **WrapperErrorConstructor**: _object_

▪ **WrapperErrorConstructorParameters**: _any[]_

**Parameters:**

| Name                      | Type                              | Description                   |
| ------------------------- | --------------------------------- | ----------------------------- |
| `innerError`              | InnerError                        | 旧的 Error                    |
| `wrapperErrorConstructor` | WrapperErrorConstructor           | 新 Error 的构造函数           |
| `...constructArgs`        | WrapperErrorConstructorParameters | 要传给新 Error 构造函数的参数 |

**Returns:** _WrapperError_

返回的新的 Error
