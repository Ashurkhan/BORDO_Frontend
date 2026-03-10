# 🔌 Интеграция с Spring Backend

Этот документ описывает как интегрировать frontend приложение Bordo с вашим Spring Backend.

## Требования к Backend API

### 1. CORS конфигурация

Ваш Spring Backend **должен разрешить запросы** с фронтенда.

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

### 2. Base URL

Frontend ожидает API на:
```
http://localhost:8080/api
```

Можно изменить в файле `.env`:
```
VITE_API_URL=http://ваш-backend.com/api
```

---

## ✅ Требуемые Endpoints

### Authentication (`/auth`)

#### POST `/api/auth/register`
Регистрация новой учетной записи.

**Request:**
```json
{
  "fullName": "Иван Иванов",
  "phone": "+7 999 123 45 67",
  "email": "ivan@example.com",
  "passwordHash": "12345"  // 5-8 символов
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullName": "Иван Иванов",
    "phone": "+7 999 123 45 67",
    "email": "ivan@example.com",
    "createdAt": "2026-01-26T10:00:00Z"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "message": "Email уже зарегистрирован"
}
```

---

#### POST `/api/auth/login`
Вход в существующую учетную запись.

**Request:**
```json
{
  "email": "ivan@example.com",
  "passwordHash": "12345"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullName": "Иван Иванов",
    "phone": "+7 999 123 45 67",
    "email": "ivan@example.com",
    "createdAt": "2026-01-26T10:00:00Z"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Неверные учетные данные"
}
```

---

#### GET `/api/auth/me`
Получить информацию о текущем пользователе.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "fullName": "Иван Иванов",
  "phone": "+7 999 123 45 67",
  "email": "ivan@example.com",
  "createdAt": "2026-01-26T10:00:00Z"
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Неверный или истекший токен"
}
```

---

### Ads (`/ads`)

#### GET `/api/ads`
Получить список объявлений с фильтрацией.

**Query Parameters:**
- `status` (optional): ACTIVE | SOLD | INACTIVE
- `categoryId` (optional): ID категории
- `page` (optional): Номер страницы (0-based)
- `size` (optional): Размер страницы (default: 20)

**Request:**
```
GET /api/ads?status=ACTIVE&categoryId=1&page=0&size=10
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Молочные коровы голштинской породы",
      "description": "Высокопродуктивные коровы, медицинский осмотр пройден",
      "price": 500000,
      "currency": "RUB",
      "status": "ACTIVE",
      "views": [
        { "id": 1, "viewedAt": "2026-01-26T09:30:00Z" }
      ],
      "seller": {
        "id": 1,
        "fullName": "Иван Иванов",
        "phone": "+7 999 123 45 67",
        "email": "ivan@example.com",
        "createdAt": "2026-01-26T10:00:00Z"
      },
      "category": {
        "id": 1,
        "name": "Коровы"
      },
      "location": {
        "id": 1,
        "city": "Москва",
        "region": "Московская область"
      },
      "favoritedBy": [],
      "createdAt": "2026-01-26T10:00:00Z",
      "updatedAt": "2026-01-26T10:00:00Z"
    }
  ],
  "totalPages": 5,
  "totalElements": 45
}
```

---

#### GET `/api/ads/{id}`
Получить детали конкретного объявления.

**Response (200 OK):** (см. формат выше)

**Error (404 Not Found):**
```json
{
  "message": "Объявление не найдено"
}
```

---

#### POST `/api/ads`
Создать новое объявление (требует аутентификацию).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Молочные коровы",
  "description": "Описание скота...",
  "price": 500000,
  "currency": "RUB",
  "categoryID": 1,
  "locationID": 1
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "Молочные коровы",
  "description": "Описание скота...",
  "price": 500000,
  "currency": "RUB",
  "status": "ACTIVE",
  "views": [],
  "seller": { /* данные текущего пользователя */ },
  "category": { /* категория */ },
  "location": { /* локация */ },
  "favoritedBy": [],
  "createdAt": "2026-01-26T10:00:00Z",
  "updatedAt": "2026-01-26T10:00:00Z"
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Требуется аутентификация"
}
```

---

#### PUT `/api/ads/{id}`
Обновить существующее объявление (только автор).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:** (тот же формат как POST)

**Response (200 OK):** (обновленное объявление)

**Error (403 Forbidden):**
```json
{
  "message": "Вы не можете редактировать это объявление"
}
```

---

#### DELETE `/api/ads/{id}`
Удалить объявление (только автор).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204 No Content)** (пусто)

**Error (403 Forbidden):**
```json
{
  "message": "Вы не можете удалить это объявление"
}
```

---

#### GET `/api/ads/user/{userId}`
Получить все объявления конкретного пользователя.

**Response (200 OK):**
```json
[
  { /* объявление 1 */ },
  { /* объявление 2 */ }
]
```

---

### Categories (`/categories`)

#### GET `/api/categories`
Получить все категории.

**Response (200 OK):**
```json
[
  { "id": 1, "name": "Коровы" },
  { "id": 2, "name": "Свиньи" },
  { "id": 3, "name": "Овцы" },
  { "id": 4, "name": "Козы" },
  { "id": 5, "name": "Птица" }
]
```

---

#### GET `/api/categories/{id}`
Получить категорию по ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Коровы"
}
```

---

### Locations (`/locations`)

#### GET `/api/locations`
Получить все локации.

**Response (200 OK):**
```json
[
  { "id": 1, "city": "Москва", "region": "Московская область" },
  { "id": 2, "city": "Санкт-Петербург", "region": "Ленинградская область" }
]
```

---

#### GET `/api/locations/{id}`
Получить локацию по ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "city": "Москва",
  "region": "Московская область"
}
```

---

### Favorites (`/favorites`)

#### POST `/api/favorites/{adId}`
Добавить объявление в избранное.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "adId": 5,
  "createdAt": "2026-01-26T10:00:00Z"
}
```

**Error (409 Conflict):**
```json
{
  "message": "Объявление уже в избранном"
}
```

---

#### DELETE `/api/favorites/{adId}`
Удалить объявление из избранного.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204 No Content)** (пусто)

---

#### GET `/api/favorites/my`
Получить мои избранные объявления.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  { /* объявление 1 */ },
  { /* объявление 2 */ }
]
```

---

## 🔐 Аутентификация

### JWT Token

Frontend ожидает получить JWT token в поле `token` при входе/регистрации:

```java
// Spring Security пример
@Bean
public JwtTokenProvider jwtTokenProvider() {
    return new JwtTokenProvider();
}

// Используйте в вашем controller:
String token = jwtTokenProvider.generateToken(user);
return new AuthResponse(token, user);
```

### Bearer Token в запросах

Frontend автоматически добавляет token в заголовок:

```
Authorization: Bearer {token}
```

Убедитесь что ваш Spring Security конфигурирует фильтры для проверки этого заголовка.

---

## 🧪 Тестирование

### Тестовые учетные данные

После запуска приложения можно использовать:

```
Email: test@example.com
Password: 12345
```

Или создайте новую учетную запись через приложение.

### Примеры curl запросов

**Регистрация:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "phone": "+7 999 999 99 99",
    "email": "test@example.com",
    "passwordHash": "12345"
  }'
```

**Вход:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "passwordHash": "12345"
  }'
```

**Получить текущего пользователя:**
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer {TOKEN}"
```

**Получить объявления:**
```bash
curl -X GET "http://localhost:8080/api/ads?status=ACTIVE" \
  -H "Accept: application/json"
```

---

## 🚀 Развертывание

### Production URL

Чтобы изменить API URL для продакшна, обновите `.env`:

```
VITE_API_URL=https://your-api.com/api
```

Затем выполните сборку:
```bash
npm run build
```

### Вариант с переменными окружения

Можно использовать переменные окружения сервера:

```bash
VITE_API_URL=https://api.example.com npm run build
```

---

## 🐛 Troubleshooting

### "CORS error"
- Проверьте что backend возвращает правильные CORS заголовки
- Убедитесь что origin в whitelist: `http://localhost:5173`

### "401 Unauthorized"
- Token истек - нужно переавторизоваться
- Token некорректный - проверьте что сервер возвращает валидный JWT

### "404 Not Found"
- Endpoint не существует на сервере
- Проверьте правильность URL в .env

### "Empty response from server"
- Backend не запущен
- Неверный базовый URL в .env
- Проверьте что backend слушает правильный port

---

## 📝 Чек-лист интеграции

- [ ] CORS конфигурирован в Spring Backend
- [ ] Все endpoints реализованы
- [ ] JWT token реализован
- [ ] Validation работает (email, password 5-8 символов)
- [ ] Backend запущен на `http://localhost:8080`
- [ ] Frontend запущен на `http://localhost:5173`
- [ ] Регистрация работает
- [ ] Вход работает
- [ ] Получение текущего пользователя работает
- [ ] Создание объявления работает
- [ ] Получение объявлений работает
- [ ] Фильтрация по категориям работает
- [ ] Добавление в избранное работает
- [ ] Удаление объявления работает

---

**Если у вас возникли вопросы, проверьте Backend логи и Frontend console!**
