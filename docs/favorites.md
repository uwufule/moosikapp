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
  "message": "Successfully added song to favorites.",
  "uuid": "00000000-0000-0000-0000-000000000000"
}
```
Возможные ошибки
```javascript
# Status Code: 404
{ "message": "No song found." }
```
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
# Status Code: 204
```
Возможные ошибки
```javascript
# Status Code: 404
{ "message": "No song found." }
{ "message": "No favorite found." }
```