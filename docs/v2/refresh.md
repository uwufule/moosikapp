## Обновление access токена с помощью refresh токена
```
Route: /login/refresh?refreshToken={refreshToken}
Method: POST
```

#### Параметры запроса
```js
{
  refreshToken: [String, 'required'],
}
```

#### Ответ
```js
// Status Code: 200
{
  accessToken: String,
  refreshToken: String,
}
```

**accessToken** используется для подтверждения факта авторизации.
Время жизни **30 минут**.

**refreshToken** (далее refresh токен) используется для обновления access токена без обращения к конечной точке входа в систему (`/login`). 
Время жизни refresh токена **30 дней**.

Все активные refresh токены могут быть отозваны, для этого используется конечная точка `/logout`. Подробнее механизм отзыва refresh токенов описан в `/logout.md`.

Несмотря на отзыв refresh токенов, access токены можно будет продолжать использовать до тех пор, пока срок их жизни не истечет.

#### Ошибки
```js
// Status Code 400
{ message: 'Invalid refresh token provided.' }
{ message: 'Refresh token expired.' }
{ message: 'Trying to get pair of tokens for deactivated user.' }
```
А также ошибка `Некорректный заголовок Accept`, описанная в **/errors/general.md**.