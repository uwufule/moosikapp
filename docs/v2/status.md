## Статус
```
Route: /status
Method: GET
```

#### Ответ
```js
// Status Code: 200
{
  message: 'Successfully retrieved status.',
  storage: {
    totalSpace: Number,
    usedSpace: Number,
    maxFileSize: Number,
  }
}
```

На данный момент не реализовано и возвращает `501 Not implemented`.