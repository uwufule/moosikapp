## Статус
```
Route: /status
Method: GET
```

Ответ
```js
// Status Code: 200
{
  message: 'Successfully retrieved status.',
  disk: {
    totalSpace: Number,
    usedSpace: Number,
    maxFileSize: Number,
  }
}
```