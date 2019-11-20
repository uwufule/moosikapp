## Музыка

#### Получить список песен
```
Route: /songs[?skip&limit&scope]
Method: GET
Headers: {
  Authorization: Bearer JWT-token
}
```

Параметры запроса
```js
{
  skip: {
    type: Number,
  },
  limit: {
    type: Number,
    value: {
      min: 1,
      max: 100,
    },
  },
  scope: {
    type: Number,
    value: {
      +1: 'favorite',
      +2: 'edit',
    }
  }
}
```
Параметр scope представляет собой битовую маску. Если вы хотите получить список с указанием, находится ли песня в вашем списке избранного, нужно указать 1. Если нужно узнать возможности редактирование песен, нужно указать 2. Если вам нужно узнать и то, и другое, то нужно указать значение 3 (= 2 + 1). В будущем значений scope может стать больше, однако, механизм выборки необходимых полей останется прежним.

Ответ
```js
// Status Code: 200
{
  message: 'Successfully retrieved songs.',
  songs: [
    {
      uuid: String, // e.g. 00000000-0000-0000-0000-000000000000
      author: String,
      title: String,
      cover: String,
      favorite?: Boolean,
      edit?: Boolean,
    }
  ]
}
```

Возможные ошибки
```js
// Status Code: 400
{ message: 'Invalid query parameter `skip` provided.' }
{ message: 'Invalid query parameter `limit` provided.' }

// Status Code: 404
{ message: 'No songs found.' }
```

#### Поиск
```
Route: /songs/search?query[&skip&limit&scope]
Method: GET
Headers: {
  Authorization: Bearer JWT-token
}
```

Параметры запроса
```js
{
  skip: {
    type: Number,
  },
  limit: {
    type: Number,
    value: {
      min: 1,
      max: 100,
    },
  },
  scope: {
    type: Number,
    value: {
      +1: 'favorite',
      +2: 'edit',
    }
  }
}
```
Параметр scope представляет собой битовую маску. Если вы хотите получить список с указанием, находится ли песня в вашем списке избранного, нужно указать 1. Если нужно узнать возможности редактирование песен, нужно указать 2. Если вам нужно узнать и то, и другое, то нужно указать значение 3 (= 2 + 1). В будущем значений scope может стать больше, однако, механизм выборки необходимых полей останется прежним.

Ответ
```js
// Status Code: 200
{
  message: 'Successfully retrieved songs.',
  songs: [
    {
      uuid: String, // e.g. 00000000-0000-0000-0000-000000000000
      author: String,
      title: String,
      cover: String,
      favorite?: Boolean,
      edit?: Boolean,
    }
  ]
}
```

Возможные ошибки
```js
// Status Code: 400
{ message: 'No query provided.' }
{ message: 'Invalid query parameter `skip` provided.' }
{ message: 'Invalid query parameter `limit` provided.' }

// Status Code: 404
{ message: 'No songs found.' }
```

#### Подробная информация
```
Route: /songs/{songId}[?scope]
Method: GET
Headers: {
  Authorization: Bearer JWT-token
}
```

Параметры URI
```js
{
  songId: [String, 'required'],
}
```

Параметры запроса
```js
{
  scope: {
    type: Number,
    value: {
      +1: 'favorite',
      +2: 'edit',
    }
  }
}
```
Параметр scope представляет собой битовую маску. Если вы хотите получить список с указанием, находится ли песня в вашем списке избранного, нужно указать 1. Если нужно узнать возможности редактирование песен, нужно указать 2. Если вам нужно узнать и то, и другое, то нужно указать значение 3 (= 2 + 1). В будущем значений scope может стать больше, однако, механизм выборки необходимых полей останется прежним.

Ответ
```js
// Status Code: 200
{
  message: 'Successfully retrieved song.',
  song: {
    author: String,
    title: String,
    cover: String,
    uploadedBy: String,
    url: String,
    createdAt: Date, // e.g. 1970-01-01T00:00:00.000Z
    avorite?: Boolean,
    edit?: Boolean,
  }
}
```

Возможные ошибки
```js
// Status Code: 404
{ message: 'No song found.' }
```

#### Загрузка
```
Route: /songs
Method: POST
Headers: {
  Authorization: Bearer JWT-token
  Content-Type: audio/mpeg
}
```

Ответ
```js
// Status Code: 201
{
  message: 'You have successfully uploaded a new song.',
  uuid: String, // e.g 00000000-0000-0000-0000-000000000000
}
```

Возможные ошибки
```js
// Status Code: 400
{ message: 'No body provided.' }

// Status Code: 403
{ message: 'Forbitten.' }

// Status Code: 406
{ message: 'Already exists.' }
{ message: 'Error while uploading.' }
```

#### Редактирование
```
Route: /songs/{songId}
Method: PATCH
Headers: {
  Content-Type: application/json
}
```

Параметры URI
```js
{
  songId: [String, 'required'],
}
```

Тело запроса
```js
{
  author?: String,
  title?: String,
  cover?: String,
}
```
В теле запроса указываются поля, которые необходимо обновить. Необязательно обновлять все поля, можно указать лишь необходимые.

Ответ
```js
// Status Code: 200
{
  message: 'Successfully updated song.',
  song: {
    author?: String,
    title?: String,
    cover?: String,
  }
}
```
В случае успешного обновления информации о песне, вернется json-объект, содержащий информацию об обновленых полях.

Возможные ошибки
```js
// Status Code: 400
{ message: 'No body provided.' }

// Status Code: 403
{ message: 'Forbitten.' }

// Status Code: 404
{ message: 'No song found.' }
```

#### Удаление
```
Route: /songs/{songId}
Method: DELETE
Headers: {
  Authorization: Bearer JWT-token
}
```

Параметры URI
```js
{
  songId: [String, 'required'],
}
```

Ответ
```
Status Code: 204
```

Возможные ошибки
```js
// Status Code: 403
{ message: 'Forbitten.' }

// Status Code: 404
{ message: 'No song found.' }
```