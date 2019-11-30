## Регистрация
```
Route: /register
Method: POST
Headers: {
  Content-Type: application/json
}
```

Тело запроса
```js
{
  username: String,
  email: String,
  password: String,
}
```

Ответ
```js
// Status Code: 201
{
  message: 'You have successfully created a new account.',
  uuid: String, // e.g. 00000000-0000-0000-0000-000000000000
}
```

Ошибки
```js
// Status Code 400
{ message: 'No body provided.' }
{ message: 'Invalid e-mail address provided.' }
{ message: 'An account with that email address and/or username already exists.' }
```