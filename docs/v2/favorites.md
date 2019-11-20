## Список избранного

#### Получить список избранных песен
```
Route: /favorites[?skip&limit&scope]
Method: GET
Headers: {
  Authorization: Bearer JWT-token
}
```

Параметры запроса
```js
{
  skip: {
    type: Number,
  },
  limit: {
    type: Number,
    value: {
      min: 1,
      max: 100,
    },
  },
  scope: {
    type: Number,
    value: {
      +1: 'favorite',
      +2: 'edit',
    }
  }
}
```

Ответ
```js
// Status Code: 200
{
  message: 'Successfully retrieved favorite songs.',
  songs: [
    {
      uuid: String, // e.g. 00000000-0000-0000-0000-000000000000
      author: String,
      title: String,
      cover: String,
    }
  ]
}
```

Возможные ошибки
```js
// Status Code: 404
{ message: 'No favorite songs found.' }
```

#### Добавить в избранное
```
Route: /favorites/{songId}
Method: POST
Headers: {
  Authorization: Bearer JWT-token
}
```

Параметры URI
```js
{
  songId: [String, 'required'],
}
```

Ответ
```js
// Status Code: 200
{
  message: 'Successfully added song to favorites.',
  uuid: String, // e.g. 00000000-0000-0000-0000-000000000000
}
```

Возможные ошибки
```js
// Status Code: 404
{ message: 'No song found.' }
```

#### Удалить из избранного
```
Route: /favorites/{songId}
Method: DELETE
Headers: {
  Authorization: Bearer JWT-token
}
```

Параметры URI
```js
{
  songId: [String, 'required'],
}
```

Ответ
```
Status Code: 204
```

Возможные ошибки
```js
# Status Code: 404
{ message: 'No song found.' }
{ message: 'No favorite found.' }
```