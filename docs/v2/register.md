## Регистрация
```
Route: /register
Method: POST
Headers: {
  Content-Type: application/json
}
```

#### Тело запроса
```js
{
  username: String,
  email: String,
  password: String,
}
```

#### Ответ
```js
// Status Code: 201
{
  message: 'You have successfully created a new account.',
  uuid: String, // e.g. 00000000-0000-0000-0000-000000000000
}
```

#### Ошибки
```js
// Status Code 400
{ message: 'Invalid username provided. Username must contain 2-24 letters or numbers. Please do not use spaces, symbols, or special characters.' }
{ message: 'Invalid e-mail address provided.' }
{ message: 'Invalid password provided. Username must be at least 8 symbols long. Use a mix of English letters, numbers and symbols.' }
{ message: 'An account with that email address and/or username already exists.' }
```
А также ошибка `Некорректный заголовок Accept`, описанная в **/errors/general.md**.