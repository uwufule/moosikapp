# API
## Вступление
Каждый запрос к API должен иметь следующие заголовки, иначе он будет отклонен.
```
Accept: application/vnd.moosik.v1+json
Content-Type: application/json
```
Некоторые запросы, помимо указанных выше заголовков, требуют авторизацию. Для этого нужно передать заголовок authorization, иначе взаимодействовать с API не получится.
```
Authorization: Bearer JWT
```
Базовый URL каждой конечной точки начинается с `https://moosikapp.tk/api`, это означает что если вам надо сделать http-запрос  к конечной точке входа в систему, URL должен иметь вид `https://moosikapp.tk/api/login`.
## Регистрация
```
Type: POST
Route: /register
```
Тело запроса
```javascript
{
  "email": "testEmail@gmail.com>",
  "username": "testUsername",
  "password": "testPassword"
}
```
Ответ
```javascript
# Status Code: 200
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
## Вход
```
Type: POST
Route: /login
```
Тело запроса
```javascript
{
  "username": "testUsername",
  "password": "testPassword"
}
# или
{
  "username": "testEmail@gmail.com",
  "password": "testPassword"
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
    "usernmae": "testUsername",
    "email": "testEmail@gmail.com",
    "permissions": 1,
    "createdAt": "Date"
  }
}
```
Возможные ошибки
```javascript
# Status Code: 404
{ "message": "No user found." }
```
## Музыка
#### Получить список песен
```
Type: GET
Route: /songs[?skip={Number}&limit={Number}]
```
Параметры запроса
```
Name: skip
Type: Number
Required: false

Name: limit
Type: Number
Required: false
Value: 1 - 100
```
Ответ
```javascript
# Status Code: 200
{
  "message": "Successfully retrieved songs.",
  "songs": [
    {
      "uuid": "00000000-0000-0000-0000-000000000000",
      "author": "songAuthor",
      "title": "songTitle",
      "cover": "coverUrl"
    }
  ]
}
```
Возможные ошибки
```javascript
# Status Code: 400
{ "message": "Invalid query parameter 'skip' provided." }
{ "message": "Invalid query parameter 'limit' provided." }

# Status Code: 404
{ "message": "No songs found." }
```
#### Поиск песен
```
Type: GET
Route: /songs[?query={String}]
```
Параметры запроса
```
Name: query
Type: String
Required: true
```
Ответ
```javascript
# Status Code: 200
{
  "message": "Successfully retrieved songs.",
  "songs": [
    {
      "uuid": "00000000-0000-0000-0000-000000000000",
      "author": "songAuthor",
      "title": "songTitle",
      "cover": "coverUrl"
    }
  ]
}
```
Возможные ошибки
```javascript
# Status Code: 400
{ "message": "No query provided." }

# Status Code: 404
{ "message": "No songs found." }
```
#### Подробная информация о песне
```
Type: GET
Route: /songs/{uuid}
```
Параметры URI
```
Name: uuid
Type: String
Required: true
```
Ответ
```javascript
# Status Code: 200
{
  "message": "Successfully retrieved song.",
  "song":  {
    "uuid": "00000000-0000-0000-0000-000000000000",
    "author": "songAuthor",
    "title": "songTitle",
    "cover": "coverUrl",
    "uploadedBy": "testUsername",
    "url": "URL",
    "createdAt": "Date"
  }
}
```
Возможные ошибки
```javascript
# Status Code: 404
{ "message": "No song found." }
```
#### Зарузка песни
```
Type: PUT
Route: /songs
```
```
Content-Type: audio/mpeg
```
Ответ
```javascript
# Status Code: 201
{
  "message": "You have successfully uploaded a new song.",
  "uuid": "00000000-0000-0000-0000-000000000000"
}
```
Возможные ошибки
```javascript
# Status Code: 400
{ "message": "No body provided." }

# Status Code: 406
{ "message": "Already exists." }
{ "message": "Error while uploading." }
```
#### Редактирование информации о песне
```
Type: PATCH
Route: /songs/{uuid}
```
Параметры URI
```
Name: uuid
Type: String
Required: true
```
Ответ
```javascript
# Status Code: 200
{
  "message": "Successfully updated song."
}
```
Возможные ошибки
```javascript
# Status Code: 400
{ "message": "No body provided." }

# Status Code: 404
{ "message": "No song found." }
```
#### Удаление песни
```
Type: DELETE
Route: /songs/{uuid}
```
Параметры URI
```
Name: uuid
Type: String
Required: true
```
Ответ
```javascript
# Status Code: 200
{
  "message": "Successfully removed song.",
  "uuid": "00000000-0000-0000-0000-000000000000"
}
```
Возможные ошибки
## Избранное
#### Получить список избранных песен
```
Type: GET
Route: /favorites
```
Ответ
```javascript
# Status Code: 200
{
  "message": "Successfully retrieved favorite songs.",
  "songs": [
    {
      "uuid": "00000000-0000-0000-0000-000000000000",
      "author": "songAuthor",
      "title": "songTitle",
      "cover": "coverUrl"
    }
  ]
}
```
Возможные ошибки
```javascript
# Status Code: 404
{ "message": "No favorite songs found." }
```
#### Добавить песню в избранные
```
Type: POST
Route: /favorites/{uuid}
```
Параметры URI
```
Name: uuid
Type: String
Required: true
```
Ответ
```javascript
# Status Code: 200
{
  "message": "Successfully added song to favorites."
  "uuid": "00000000-0000-0000-0000-000000000000"
}
```
Возможные ошибки
#### Удалить песню из избранного
```
Type: DELETE
Route: /favorites/{uuid}
```
Параметры URI
```
Name: uuid
Type: String
Required: true
```
Ответ
```javascript
# Status Code: 200
{
  "message": "Successfully removed song from favorites.",
  "uuid": "00000000-0000-0000-0000-000000000000"
}
```
## Статус
```
Type: GET
Route: /status
```
Ответ
```javascript
# Status Code: 200
{
  "message": "Successfully retrieved status.",
  "disk": [
    {
      "totalSpace": "0",
      "usedSpace": "0",
      "maxFileSize": "0"
    }
  ]
}
```
Возможные ошибки
```javascript
# Status Code: 404
{ "message": "No favorite songs found." }
```