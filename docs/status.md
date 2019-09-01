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
Предполагается, что при нормальной работе API ошибок тут быть не должно.