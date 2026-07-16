
---

## Установка

Для запуска проекта вам понадобятся установленные **Node.js** (версии 18+) и менеджер пакетов **npm** (или yarn).

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/kokarev8008/GameQuestAPI
   cd GameQuestAPI
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

---

## Запуск приложения

### Режим разработки (с автоматическим перезапуском через nodemon)
```bash
npm run dev
```

### Продакшн режим
```bash
npm start
```
После запуска API будет доступно по адресу: `http://127.0.0.1:3000`

---

## Эндпоинты (Endpoints) и примеры запросов:

### 1. Получить все объекты
* **URL:** `/quests`
* **Метод:** `GET`

**Пример запроса (сURL):**
```bash
curl -X GET http://localhost:3000/quests
```

**Ответ (Response 200 OK):**
```json
[
  {
    "id": 1,
    "title": "boss",
    "difficulty": "medium",
    "rewardXp": 2,
    "description": "",
    "completed": false,
    "createdAt": "2026-06-12T19:00:02.826Z"
  },
  {
    "id": 2,
    "title": "boss",
    "difficulty": "hard",
    "rewardXp": 52,
    "description": "that is a been long fight...",
    "completed": false,
    "createdAt": "2026-06-12T19:00:17.509Z"
  },
]
```

### 1.1 Получить элемент по id
* **URL:** `/quests/:id`
* **Метод:** `GET`

**Пример запроса (сURL):**
```bash
curl -X GET http://localhost:3000/quests/1
```

**Ответ (Response 200 OK):**
```json
{
  "id": 1,
  "title": "boss",
  "difficulty": "medium",
  "rewardXp": 2,
  "description": "",
  "completed": false,
  "createdAt": "2026-06-12T19:00:02.826Z"
}
```


### 2. Создать новый объект
* **URL:** `/quests`
* **Метод:** `POST`

**Тело запроса (Request Body):**
```json
{
  "title": "find mom",
  "difficulty": "easy",
  "rewardXp": 11,
  "description": "hi mom!", // - необязательный элемент  
}
```

**Пример запроса (cURL):**
```bash
curl -X POST http://localhost:3000/quests \
  -H "Content-Type: application/json" \
  -d '{"title": "find mom", "difficulty": "easy", "rewardXp": 11, "description": "hi mom!"}'
```

**Ответ (Response 201 Created):**
```json
{
  "id": 1,                                // - создаётся на сервере
  "title": "find mom",
  "difficulty": "easy",
  "rewardXp": 11,
  "description": "hi mom!",               // - создаётся по умолчанию("") если не был явно объявлен в body
  "completed": false,                     // - создаётся по умолчанию(false) на сервере
  "createdAt": "2026-06-12T20:00:00.000Z" // - создаётся на сервере
}
```

### 3. Изменить элемент(-ы) объекта
* **URL:** `/quests/:id`
* **Метод:** `PATCH`

**Изначальный объект**
```json
{
  "id": 1,                                //Не подлежит изменению
  "title": "find mom",
  "difficulty": "easy",
  "rewardXp": 11,
  "description": "",
  "completed": false,
  "createdAt": "2026-06-12T20:00:00.000Z" //Не подлежит изменению
}
```

**Тело запроса (Request Body):**
```json
{
  "title": "sobaken",
  "difficulty": "medium",
  "rewardXp": 12,
  "description": "LOL",
  "completed": true
}
```

**Пример запроса (cURL):**
```bash
curl -X PATCH http://localhost:3000/quests/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "sobaken", "difficulty": "medium", "rewardXp": 12, "description": "LOL", "completed": true}'
```

**Ответ (Response 200 Ok):**
```json
{
  "id": 1,
  "title": "sobaken",
  "difficulty": "medium",
  "rewardXp": 12,
  "description": "LOL",
  "completed": true,
  "createdAt": "2026-06-12T20:00:00.000Z"
}
```

### 4. Удаление объекта
* **URL:** `/quests/:id`
* **Метод:** `DELETE`

**Пример запроса (сURL):**
```bash
curl -X DELETE http://localhost:3000/quests/1
```

**Ответ (Response 204 No Content):**
```json
  No Content
``` 
