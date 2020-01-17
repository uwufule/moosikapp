## Пользователи

## Информация о пользователе
```
Route: /users/{username}
Method: GET
Headers: {
  Authorization: access-token
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
    uuid: String, // e.g. 00000000-0000-0000-0000-000000000000
    username: String,
    email: String,
    role: Number,
    createdAt: Date, // e.g. 1970-01-01T00:00:00.000Z
  }
}
```

#### Ошибки
```js
// Status Code: 404
{ message: 'No user found.' }
```
А также ошибки `Ошибка авторизации`, `Некорректный заголовок Accept`, описанные в **/errors/general.md**.