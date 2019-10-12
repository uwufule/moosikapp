## Пользователи
#### Получить информацию о пользователе
```
Type: GET
Route: /users/{username}
```
Параметры URI
```
Name: username
Type: String
Required: true
```
Ответ
```javascript
# Status Code: 200
{
  "message": "Successfully retrieved user.",
  "user": {
    "uuid": "00000000-0000-0000-0000-000000000000",
    "username": "testUser",
    "email": "testUser@gmail.com",
    "role": 1,
    "createdAt": "1970-01-01T00:00:00.000Z"
  }
}
```
Возможные ошибки
```javascript
# Status Code: 404
{ "message": "No user found." }
```