# 🚀 Запуск Frontend и Backend одновременно

Это руководство показывает как запустить React фронтенд и Spring Backend вместе на локальной машине.

## ⚠️ Важно: Две разные папки!

```
C:\Users\User\Desktop\
├── intern_react/college/          ← React Frontend (этот проект, npm run dev)
│   ├── package.json
│   ├── vite.config.ts
│   └── localhost:5173
│
└── your-spring-project/           ← Ваш Spring Backend (отдельная папка, mvn spring-boot:run)
    ├── pom.xml
    ├── src/main/java/
    └── localhost:8080
```

---

## ⚙️ Текущая конфигурация

### Frontend (React в этой папке)
- **Папка:** `c:\Users\User\Desktop\intern_react\college`
- **Port:** 5173
- **URL:** http://localhost:5173
- **API Base:** http://localhost:8080/api

### Backend (Ваш отдельный Spring проект)
- **Папка:** `c:\путь\к\вашему\spring\проекту`
- **Port:** 8080
- **URL:** http://localhost:8080
- **API Base:** /api

---

## 📋 Требования

- **Java 11+** (для Spring Boot)
- **Node.js 16+** (для React)
- **npm** (включен с Node.js)

---

## 🔧 Вариант 1: Использование двух терминалов (РЕКОМЕНДУЕТСЯ)

Это самый простой способ для разработки.

### Шаг 1: Откройте первый терминал (для Backend)

```bash
# Перейдите в ВАШУ папку Spring проекта
cd c:\path\to\your\spring\project

# Запустите Spring Boot сервер
mvn spring-boot:run

# Или если используете gradle:
gradle bootRun
```

Ожидайте сообщение:
```
Started YourApplication in X.XXX seconds (Порт: 8080)
```

### Шаг 2: Откройте ВТОРОЙ терминал (для Frontend)

⚠️ **ВАЖНО:** Это ДРУГОЙ терминал! Первый все еще должен работать!

```bash
# Перейдите в папку React фронтенда (этот проект)
cd c:\Users\User\Desktop\intern_react\college

# Установите зависимости (если еще не установлены)
npm install

# Запустите dev сервер
npm run dev
```

Ожидайте сообщение:
```
VITE v7.3.1 ready in XXX ms

➜ Local:   http://localhost:5173/
➜ Press q to quit
```

Вы увидите:
```
VITE v7.3.1  ready in 306 ms
  ➜  Local:   http://localhost:5173/
```

### Шаг 3: Откройте браузер

Перейдите на http://localhost:5173 и приложение готово к работе!

---

## 🔧 Вариант 2: Использование одного терминала с PowerShell

Запустите оба сервиса в одном терминале с использованием background jobs.

```powershell
# Откройте PowerShell в папке college

# Запустите Backend в фоне
Start-Job -ScriptBlock {
  cd c:\path\to\your\spring\project
  mvn spring-boot:run
} -Name "backend"

# Запустите Frontend
cd c:\Users\User\Desktop\intern_react\college
npm run dev

# Оба сервиса будут работать одновременно!
```

### Для остановки:

```powershell
# Останавливает frontend (используйте Ctrl+C)

# Для остановки backend:
Stop-Job -Name "backend"
Remove-Job -Name "backend"
```

---

## 🔧 Вариант 3: npm-run-all (для npm скриптов)

Если вы хотите еще более удобное решение:

### Установка

```bash
npm install --save-dev npm-run-all
```

### Обновите package.json

Добавьте скрипт в `"scripts"`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "dev:with-backend": "npm-run-all --parallel dev backend"
  }
}
```

### Использование

```bash
npm run dev:with-backend
```

**Примечание:** Это запустит frontend, но вы все равно должны запустить backend вручную в другом терминале, так как это не может автоматически запустить Java приложение.

---

## ✅ Проверка подключения

### 1. Проверьте что оба сервера запущены

**Backend:**
```powershell
curl http://localhost:8080/api/categories
# Должно вернуть данные или 401 (если требует аутентификацию)
```

**Frontend:**
```
http://localhost:5173
# Должна открыться страница приложения
```

### 2. Проверьте DevTools браузера

Откройте DevTools (F12):
- Перейдите на вкладку **Network**
- Попробуйте зарегистрироваться
- Вы должны увидеть POST запрос к `/api/auth/register`
- Статус должен быть 2xx или 4xx (но не CORS ошибка)

### 3. Проверьте API URL

В браузере выполните в console:
```javascript
fetch('http://localhost:8080/api/categories')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

Вы должны увидеть ответ от backend или сообщение об ошибке.

---

## 🐛 Решение проблем

### "Cannot GET /api/categories"

**Причина:** Backend не запущен или endpoint не существует

**Решение:**
1. Проверьте что Spring Boot запущен (`mvn spring-boot:run`)
2. Проверьте логи Spring на ошибки
3. Убедитесь что эндпоинты реализованы согласно документации

### "CORS error: Access to XMLHttpRequest... blocked by CORS policy"

**Причина:** Backend не разрешает запросы с фронтенда

**Решение:** Добавьте CORS конфигурацию в Spring:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

### "400 Bad Request" при регистрации

**Причина:** Spring валидация отклонила данные

**Решение:**
1. Проверьте что данные соответствуют Entity (ФИО, почта, телефон)
2. Пароль должен быть 5-8 символов
3. Email должен быть в формате `user@example.com`
4. Посмотрите логи Spring для деталей

### "401 Unauthorized" после входа

**Причина:** Token не генерируется или не проверяется правильно

**Решение:**
1. Убедитесь что JWT генерируется при входе
2. Проверьте что токен возвращается в ответе
3. Убедитесь что Spring проверяет Bearer token корректно

---

## 📝 Пример полного Flow

### 1. Terminal 1: Запуск Backend

```powershell
cd C:\Users\YourUser\Projects\MySpringApp
mvn spring-boot:run
```

Вывод:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| \_\__,_| / / / /
 =========|_|====================/_/_/_/

Started Application in 5.234 seconds
```

### 2. Terminal 2: Запуск Frontend

```powershell
cd c:\Users\User\Desktop\intern_react\college
npm run dev
```

Вывод:
```
  VITE v7.3.1  ready in 306 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 3. Browser

```
http://localhost:5173
```

Приложение загружается ✅

### 4. Тестирование

1. Нажмите "Регистрация"
2. Заполните форму:
   ```
   ФИО: Иван Иванов
   Телефон: +7 999 123 45 67
   Email: ivan@example.com
   Пароль: 12345
   ```
3. Нажмите "Зарегистрироваться"
4. Должны увидеть каталог объявлений

---

## 🔗 Структура запросов

### Как фронтенд подключается к backend

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Browser                              │
│              http://localhost:5173                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         React Application (Vite)                     │ │
│  │  ├─ Components                                       │ │
│  │  ├─ Services (axios)                                │ │
│  │  └─ Context (Auth)                                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           │ HTTP Requests                  │
│                           │ (JSON)                         │
│                           ▼                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ http://localhost:8080/api
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Spring Boot Server                       │
│              http://localhost:8080                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         REST API Controllers                         │ │
│  │  ├─ @RestController /api/auth                        │ │
│  │  ├─ @RestController /api/ads                        │ │
│  │  ├─ @RestController /api/categories                │ │
│  │  └─ @RestController /api/favorites                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         Database (PostgreSQL, MySQL, etc)           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Статус сервисов

Используйте эту таблицу для проверки статуса:

| Сервис | URL | Порт | Статус |
|--------|-----|------|--------|
| Frontend (React) | http://localhost:5173 | 5173 | ✅ |
| Backend (Spring) | http://localhost:8080 | 8080 | ❓ |
| API Base | http://localhost:8080/api | 8080 | ❓ |
| Database | зависит от config | - | ❓ |

---

## 🎯 Быстрая запуск

### Для разработки (рекомендуемый способ)

**Terminal 1 (Backend):**
```bash
cd path\to\spring\project
mvn spring-boot:run
```

**Terminal 2 (Frontend):**
```bash
cd c:\Users\User\Desktop\intern_react\college
npm run dev
```

**Browser:**
```
http://localhost:5173
```

### Для продакшена

```bash
# 1. Build frontend
npm run build

# 2. Copy dist/ to spring static folder
# 3. Deploy spring app

# 4. Frontend будет доступен по основному URL
```

---

## 🔄 Горячая перезагрузка

### Frontend

- **Автоматическая:** Любое изменение в `src/` → автоматическая перезагрузка в браузере
- Спасибо Vite!

### Backend

- **Требует перезагрузка:** Java обычно требует перезагрузки
- **Spring Dev Tools:** Установите для автоматической перезагрузки:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

---

## 📚 Дополнительно

Для детальной информации по интеграции смотрите:
- [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) - Все API endpoints
- [QUICK_START.md](./QUICK_START.md) - Быстрый старт
- [COMPONENTS_DOCUMENTATION.md](./COMPONENTS_DOCUMENTATION.md) - Как работает frontend

---

**Готовы начинать разработку! Удачи! 🚀**
