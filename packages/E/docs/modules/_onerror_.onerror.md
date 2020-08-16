[@c4/e](../README.md) › [Globals](../globals.md) › ["onError"](_onerror_.md) › [onError](_onerror_.onerror.md)

# Namespace: onError

## Callable

▸ **onError**‹**T1**, **T2**›(`predicate`: [ErrPredicate](_onerror_.onerror.md#errpredicate)‹T1›): _function_

_Defined in [packages/E/src/onError.ts:46](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/onError.ts#L46)_

一个帮助函数，主要用于 `Promise` 的 `.catch` 方法。

返回一个新函数，当新函数的参数符合 `predicate` 时，回调 `handler`。
`handler` 的返回值会被 `onError` 返回

PS. `predicate` 参数原本支持传入构造函数（`onError(ConflictHttpError)`），后
来发现这个设计存在问题，因为 `Error()` 类似 `Boolean()`/`Number()` ，没有
`new` 关键字时也会返回对象，使得判断始终为真，引发 BUG 。最终我们移除了这个设
计

**`example`**

```js
fetch(url)
  .then(raiseHttpErrors)
  .catch(
    onError(instanceOf(ConflictHttpError), (err) => {
      return 123
    }),
  )
  .catch(
    onError(isAxiosError, (err) => {
      return 123
    }),
  )
  .then((data) => {
    data === 123 // => true
  })
```

柯里化：

```js
const onConflict = onError(instanceOf(ConflictHttpError))

fetch(url)
  .then(raiseHttpErrors)
  .catch(
    onConflict((err) => {
      return 123
    }),
  )
  .then((data) => {
    data === 123 // => true
  })
```

**Type parameters:**

▪ **T1**

▪ **T2**

**Parameters:**

| Name        | Type                                                  | Description          |
| ----------- | ----------------------------------------------------- | -------------------- |
| `predicate` | [ErrPredicate](_onerror_.onerror.md#errpredicate)‹T1› | 一个返回布尔值的函数 |

**Returns:** _function_

▸ (`handler`: [Handler](_onerror_.onerror.md#handler)‹T1, T2›): _VoidToUndefined‹T2›_

**Parameters:**

| Name      | Type                                            | Description                  |
| --------- | ----------------------------------------------- | ---------------------------- |
| `handler` | [Handler](_onerror_.onerror.md#handler)‹T1, T2› | 当错误的类匹配时要回调的函数 |

▸ **onError**‹**T1**, **T2**›(`predicate`: [ErrPredicate](_onerror_.onerror.md#errpredicate)‹T1›, `handler`: [Handler](_onerror_.onerror.md#handler)‹T1, T2›): _VoidToUndefined‹T2›_

_Defined in [packages/E/src/onError.ts:49](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/onError.ts#L49)_

**Type parameters:**

▪ **T1**

▪ **T2**

**Parameters:**

| Name        | Type                                                  |
| ----------- | ----------------------------------------------------- |
| `predicate` | [ErrPredicate](_onerror_.onerror.md#errpredicate)‹T1› |
| `handler`   | [Handler](_onerror_.onerror.md#handler)‹T1, T2›       |

**Returns:** _VoidToUndefined‹T2›_

## Index

### Type aliases

- [ErrPredicate](_onerror_.onerror.md#errpredicate)
- [Handler](_onerror_.onerror.md#handler)

## Type aliases

### ErrPredicate

Ƭ **ErrPredicate**: _function_

_Defined in [packages/E/src/onError.ts:71](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/onError.ts#L71)_

#### Type declaration:

▸ (`err`: any): _err is T_

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `err` | any  |

---

### Handler

Ƭ **Handler**: _function_

_Defined in [packages/E/src/onError.ts:69](https://github.com/bolasblack/js-metarepo/blob/aad8249/packages/E/src/onError.ts#L69)_

#### Type declaration:

▸ (`err`: T1): _T2_

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `err` | T1   |
