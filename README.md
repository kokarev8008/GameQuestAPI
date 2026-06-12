
---

## Установка

Для запуска проекта вам понадобятся установленные **Node.js** (версии 18+) и менеджер пакетов **npm** (или yarn).

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com
   cd имя-репозитория
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

## Эндпоинты (Endpoints) и примеры запросов

### 1. Получить все элементы
* **URL:** `/quest`
* **Метод:** `GET`

**Пример запроса (сURL):**
```bash
curl -X GET http://localhost:3000/quest
```

**Ответ (Response 200 OK):**
```json
[
  {
    "id": 1,
    "title": "boss",
    "difficulty": "medium",
    "rewardXp": 2,
    "completed": false,
    "createdAt": "2026-06-12T19:00:02.826Z"
  },
  {
    "id": 2,
    "title": "boss",
    "difficulty": "hard",
    "rewardXp": 52,
    "completed": false,
    "createdAt": "2026-06-12T19:00:17.509Z"
  },
]
```

### 2. Создать новый элемент
* **URL:** `/quest`
* **Метод:** `POST`

**Тело запроса (Request Body):**
```json
{
    "title": "find mom",
    "difficulty": "easy",
    "rewardXp": 11
}
```

**Пример запроса (cURL):**
```bash
curl -X POST http://localhost:3000/quest \
  -H "Content-Type: application/json" \
  -d '{"title": "find mom", "difficulty": "easy", "rewardXp": 11, "completed": false}'
```

**Ответ (Response 201 Created):**
```json
{
  "id": "1",
  "title": "find mom",
  "difficulty": "easy",
  "rewardXp": 11,
  "completed": false,
  "createdAt": "2026-06-12T20:00:00.000Z"
}
```