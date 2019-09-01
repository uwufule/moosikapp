## Вход
```
Type: POST
Route: /login
```
Тело запроса
```javascript
{
  "username": "testUser",
  "password": "superSecretPassword"
}
# или
{
  "username": "testUser@gmail.com",
  "password": "superSecretPassword"
}
```
Ответ
```javascript
# Status Code: 200
{
  "message": "Successfully logged in.",
  "token": "JWT"
}
```
Возможные ошибки
```javascript
# Status Code: 400
{ "message": "No body provided." }

# Status Code: 401
{ "message": "Invalid authorization." }

# Status Code 403
{ "message": "This account has been deactivated." }
```