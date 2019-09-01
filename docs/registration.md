## Регистрация
```
Type: POST
Route: /register
```
Тело запроса
```javascript
{
  "email": "testUser@gmail.com>",
  "username": "testUser",
  "password": "superSecretPassword"
}
```
Ответ
```javascript
# Status Code: 201
{
  "message": "You have successfully created a new account.",
  "uuid": "00000000-0000-0000-0000-000000000000"
}
```
Возможные ошибки
```javascript
# Status Code 400
{ "message": "No body provided." }
{ "message": "Invalid e-mail address provided." }
{ "message": "An account with that email address and/or username already exists." }
```