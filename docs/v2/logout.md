## Отзыв refresh токенов (выход из системы)
```
Route: /logout
Method: POST
Headers: {
  Authorization: Bearer access-token
}
```

#### Ответ
```js
// Status Code: 200
{
  message: "Successfully logged out.",
}
```

#### Ошибки
```js
// Status Code 410
{ message: 'Already logged out.' }
```
А также ошибки `Ошибка авторизации`, `Некорректный заголовок Accept`, описанные в **/errors/general.md**.