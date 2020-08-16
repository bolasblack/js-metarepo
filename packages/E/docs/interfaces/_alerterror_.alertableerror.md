[@c4/e](../README.md) › [Globals](../globals.md) › ["AlertError"](../modules/_alerterror_.md) › [AlertableError](_alerterror_.alertableerror.md)

# Interface: AlertableError

Alertable 是一种特殊接口，当收到任何一个错误有实现这个接口时，说明抛出这个错
误的代码认为自己已经提供了一个可以直接向用户展示的错误信息，所以除非当前代码
确认自己能够提供一个更有针对性的错误信息，否则应该直接继承或者展示当前错误的
`displayMessage` 属性值

**`example`**

```js
doSomething().catch(
  onError(isErrorAlertable, (err) => {
    alertService.showAlert({ message: err.displayMessage })

    throw new OtherError({
      innerError: err,
      displayMessage: err.displayMessage,
    })
  }),
)
```

## Hierarchy

- **AlertableError**

## Implemented by

- [AlertError](../classes/_alerterror_.alerterror.md)

## Index

### Properties

- [displayMessage](_alerterror_.alertableerror.md#displaymessage)

## Properties

### displayMessage

• **displayMessage**: _string_

_Defined in [packages/E/src/AlertError.ts:28](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/AlertError.ts#L28)_

用于展示的文案
