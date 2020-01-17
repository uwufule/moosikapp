## Пользователи

## Информация о пользователе
```
Route: /users/{username}
Method: GET
Headers: {
  Authorization: Bearer access-token
}
```

#### Параметры URI
```js
{
  username: [String, 'required'],
}
```

#### Ответ
```js
{
  message: 'Successfully retrieved user.',
  user: {
    uuid: [String, { example: "00000000-0000-0000-0000-000000000000" }],
    username: String,
    email: String,
    role: Number,
    createdAt: [Date, { example: "1970-01-01T00:00:00.000Z" }],
  }
}
```

#### Ошибки
```js
// Status Code: 404
{ message: 'No user found.' }
```
А также ошибки `Ошибка авторизации`, `Некорректный заголовок Accept`, описанные в **/errors/general.md**.