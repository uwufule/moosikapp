## Вход
```
Route: /login
Method: POST
Headers: {
  Content-Type: application/json
}
```

Тело запроса
```js
{
  username: String, // username or e-mail
  password: String,
}
```

Ответ
```js
// Status Code: 200
{
  message: 'Successfully logged in.',
  token: String, // JWT-token
}
```

Ошибки
```js
// Status Code: 400
{ message: 'No body provided.' }

// Status Code: 401
{ message: 'Invalid authorization.' }

// Status Code 403
{ message: 'This account has been deactivated.' }
```