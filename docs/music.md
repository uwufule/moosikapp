## Музыка
#### Получить список песен
```
Type: GET
Route: /songs[?skip={Number}&limit={Number}&scope={scopes}]
```
Параметры запроса
```
Name: skip
Type: Number
Required: false

Name: limit
Type: Number
Value: 1-100
Required: false

Name: scope
Type: Number
Value: {
  "+1": "favorite",
  "+2": "edit"
}
Required: false
```
Параметр scope представляет собой битовую маску. Если вы хотите получить список с указанием, находится ли песня в вашем избранном, нужно указать 1. Если нужно узнать возможносте редактирование песен, нужно указать 2. Если вам нужно узнать и то, и другое, то нужно указать значение 3 (2 + 1). В будущем значений scope может стать больше, однако, механизм выборки необходимых полей останется прежним.
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
      "cover": "coverUrl",
      "favorite?": false,
      "edit?": true
    }
  ]
}
```
Возможные ошибки
```javascript
# Status Code: 400
{ "message": "Invalid query parameter `skip` provided." }
{ "message": "Invalid query parameter `limit` provided." }

# Status Code: 404
{ "message": "No songs found." }
```
#### Поиск песен
```
Type: GET
Route: /songs?query={queryString}[&scope={scopes}]
```
Параметры запроса
```
Name: query
Type: String
Required: true

Name: scope
Type: Number
Value: {
  "+1": "favorite",
  "+2": "edit"
}
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
      "cover": "coverUrl",
      "favorite?": false,
      "edit?": true
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
    "author": "songAuthor",
    "title": "songTitle",
    "cover": "coverUrl",
    "uploadedBy": "testUser",
    "url": "songUrl",
    "createdAt": "1970-01-01T00:00:00.000Z",
    "favorite": false,
    "edit": true
  }
}
```
Возможные ошибки
```javascript
# Status Code: 404
{ "message": "No song found." }
```
#### Загрузка песни
```
Type: POST
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

# Status Code: 403
{ "message": "Forbitten." }

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
Тело запроса
```javascript
{
  "author?": "newSongAuthor",
  "title?": "newSongTitle",
  "cover?": "newCoverUrl"
}
```
В теле запроса указываются поля, которые необходимо обновить. Необязательно обновлять все поля, можно указать лишь необходимые.
Ответ
В случае успешного обновления информации о песне, вернется json-объект, содержащий информацию об обновленых полях.
```javascript
# Status Code: 200
{
  "message": "Successfully updated song."
  "song": {
    "author?": "newSongAuthor",
    "title?": "newSongTitle",
    "cover?": "newCoverUrl"
  },
}
```
Возможные ошибки
```javascript
# Status Code: 400
{ "message": "No body provided." }

# Status Code: 403
{ "message": "Forbitten." }

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
# Status Code: 204
```
Возможные ошибки
```javascript
# Status Code: 403
{ "message": "Forbitten." }

# Status Code: 404
{ "message": "No song found." }
```