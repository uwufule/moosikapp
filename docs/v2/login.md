## Вход
```
Route: /login
Method: POST
Headers: {
  Content-Type: application/json
}
```

#### Тело запроса
```js
{
  username: [String, 'required'],
  password: [String, 'required'],
}
```

Поле **username** может принимать e-mail адрес пользователя, указанный им при регистрации или само имя пользователя.

#### Ответ
```js
// Status Code: 200
{
  message: 'Successfully logged in.',
  token: String,
  refreshToken: String,
}
```

**token** (далее _access токен_) используется для подтверждения факта авторизации.
Время жизни **1 день**.
По окончанию жизни, access токен можно обновить, обратившись к конечной точке **/login/refresh**.

**refreshToken** (далее refreh токен) используется для обновления access токена без обращения к конечной точке входа в систему (`/login`). 
Время жизни refresh токена **30 дней**.

Подробнее механизм обновления access токена описан в **/refresh.md**.

#### Ошибки
```js
// Status Code: 400
{ message: 'Invalid body provided.' }
{ message: 'Username required.' }
{ message: 'Password required.' }

// Status Code: 401
{ message: 'Invalid authorization.' }

// Status Code 403
{ message: 'This account has been deactivated.' }
```
А также ошибка `Некорректный заголовок Accept`, описанная в **/errors/general.md**.