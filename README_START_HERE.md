# 🐄 BORDO - Интернет-магазин скота

Полнофункциональное веб-приложение для покупки и продажи скота онлайн. Построено на **React** + **Spring Boot**.

---

## 📖 Документация

### 🚀 Начните отсюда
- **[RUN_LOCALLY.md](./RUN_LOCALLY.md)** ← **НАЧНИТЕ ЗДЕСЬ!**
  - Как запустить Frontend и Backend одновременно
  - Решение распространенных проблем
  
### 🔧 Подготовка Backend
- **[SPRING_BACKEND_SETUP.md](./SPRING_BACKEND_SETUP.md)**
  - Требуемые Entity и Controller классы
  - CORS конфигурация
  - Примеры кода для Spring Boot

### 📋 Полная документация
- **[QUICK_START.md](./QUICK_START.md)** - Быстрое начало
- **[BORDO_README.md](./BORDO_README.md)** - Полная информация о приложении
- **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** - Все API endpoints
- **[COMPONENTS_DOCUMENTATION.md](./COMPONENTS_DOCUMENTATION.md)** - Компоненты и архитектура
- **[EXAMPLES.md](./EXAMPLES.md)** - Примеры кода
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Статус проекта
- **[INDEX.md](./INDEX.md)** - Навигация по документации

---

## ⚠️ Структура проектов

**Frontend и Backend - это РАЗНЫЕ проекты в РАЗНЫХ папках!**

```
C:\Users\User\Desktop\
├── intern_react/college/          ← React Frontend (этот проект)
│   └── npm run dev → localhost:5173
│
└── your-spring-project/           ← Ваш Spring Backend (отдельная папка)
    └── mvn spring-boot:run → localhost:8080
```

## ⚡ Быстрый старт (3 шага)

### Шаг 1️⃣: Запустите Backend (Spring Boot)

```bash
cd path/to/your/spring/project
mvn spring-boot:run
```

**Ожидайте сообщение:** `Started YourApplication in X.XXX seconds`

### Шаг 2️⃣: Откройте второй терминал и запустите Frontend (React)

```bash
cd c:\Users\User\Desktop\intern_react\college
npm run dev
```

**Ожидайте сообщение:** `VITE ready in XXX ms → Local: http://localhost:5173`

### Шаг 3️⃣: Откройте браузер

```
http://localhost:5173
```

✅ **Готово! Приложение работает!**

---

## 🎯 Что может сделать приложение

### 👤 Аутентификация
- ✅ Регистрация новых пользователей
- ✅ Вход в систему
- ✅ Выход из системы
- ✅ Сохранение сессии

### 📢 Объявления
- ✅ Просмотр всех объявлений
- ✅ Фильтрация по категориям
- ✅ Просмотр деталей объявления
- ✅ Создание новых объявлений
- ✅ Редактирование объявлений
- ✅ Удаление объявлений

### ❤️ Избранное
- ✅ Добавление объявлений в избранное
- ✅ Просмотр избранных объявлений
- ✅ Удаление из избранного

### 👤 Профиль
- ✅ Просмотр личной информации
- ✅ Управление своими объявлениями
- ✅ Просмотр статистики

---

## 🛠️ Технологический стек

### Frontend
- **React 19** - UI библиотека
- **React Router v6** - Маршрутизация
- **TypeScript** - Типизация
- **Axios** - HTTP клиент
- **Vite** - Сборка и dev server
- **CSS3** - Стилизация

### Backend
- **Spring Boot** - REST API
- **Spring Security** - Аутентификация
- **Spring Data JPA** - Работа с БД
- **JWT** - Токены
- **Maven** - Управление зависимостями

### База данных
- PostgreSQL / MySQL / H2 (выберите сами)

---

## 📁 Структура проекта

```
college/
├── src/
│   ├── components/          # React компоненты
│   │   ├── Header.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── AdsList.tsx
│   │   ├── AdDetails.tsx
│   │   ├── Profile.tsx
│   │   ├── Favorites.tsx
│   │   └── CreateAd.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx  # Управление аутентификацией
│   │
│   ├── services/
│   │   └── api.ts           # API клиент (Axios)
│   │
│   ├── types/
│   │   └── index.ts         # TypeScript интерфейсы
│   │
│   ├── styles/              # CSS файлы
│   │   ├── Header.css
│   │   ├── Auth.css
│   │   ├── Ads.css
│   │   ├── AdDetails.css
│   │   ├── Profile.css
│   │   ├── Favorites.css
│   │   ├── CreateAd.css
│   │   └── index.css
│   │
│   ├── App.tsx              # Главный компонент
│   └── main.tsx             # Точка входа
│
├── public/                  # Статические файлы
├── dist/                    # Production сборка
│
├── package.json             # npm зависимости
├── vite.config.ts           # Vite конфигурация
├── tsconfig.json            # TypeScript конфигурация
├── .env                     # Переменные окружения
│
└── Документация (8 файлов):
    ├── RUN_LOCALLY.md                # ⭐ Как запустить
    ├── SPRING_BACKEND_SETUP.md       # ⭐ Подготовка Backend
    ├── QUICK_START.md
    ├── BORDO_README.md
    ├── BACKEND_INTEGRATION.md
    ├── COMPONENTS_DOCUMENTATION.md
    ├── EXAMPLES.md
    └── PROJECT_STATUS.md
```

---

## 🔌 API конфигурация

### Текущие настройки

```
Frontend: http://localhost:5173
Backend:  http://localhost:8080
API Base: http://localhost:8080/api
```

### Как изменить URL API

Отредактируйте файл `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## 📋 Требуемые API endpoints

### 🔐 Authentication
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь

### 📢 Ads
- `GET /api/ads` - Все объявления (с фильтрацией)
- `GET /api/ads/{id}` - Одно объявление
- `POST /api/ads` - Создать объявление
- `PUT /api/ads/{id}` - Обновить объявление
- `DELETE /api/ads/{id}` - Удалить объявление
- `GET /api/ads/user/{userId}` - Объявления пользователя

### 📂 Categories
- `GET /api/categories` - Все категории
- `GET /api/categories/{id}` - Одна категория

### 📍 Locations
- `GET /api/locations` - Все локации
- `GET /api/locations/{id}` - Одна локация

### ❤️ Favorites
- `POST /api/favorites/{adId}` - Добавить в избранное
- `DELETE /api/favorites/{adId}` - Удалить из избранного
- `GET /api/favorites/my` - Мои избранные

**Подробнее:** [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)

---

## 🚀 Команды разработки

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Просмотр продакшен сборки
npm run preview

# Проверка кода
npm run lint
```

---

## 🐛 Решение проблем

### CORS ошибки?
→ Смотрите [SPRING_BACKEND_SETUP.md](./SPRING_BACKEND_SETUP.md#1-cors-конфигурация)

### Backend не подключается?
→ Смотрите [RUN_LOCALLY.md](./RUN_LOCALLY.md#-решение-проблем)

### Другие вопросы?
→ Смотрите [QUICK_START.md](./QUICK_START.md#часто-встречающиеся-вопросы)

---

## 📊 Статистика проекта

| Метрика | Значение |
|---------|----------|
| Страниц | 7 |
| Компонентов React | 8 |
| API endpoints | 20+ |
| Строк кода | ~4000 |
| Стилей CSS | 1800+ строк |
| Размер JS (gzipped) | 93 KB |
| Размер CSS (gzipped) | 3.5 KB |

---

## ✅ Чек-лист интеграции

### Backend разработчик
- [ ] Прочитал [SPRING_BACKEND_SETUP.md](./SPRING_BACKEND_SETUP.md)
- [ ] Реализовал все Controllers
- [ ] Создал CORS конфигурацию
- [ ] Реализовал JWT аутентификацию
- [ ] Тестировал endpoints с curl

### Frontend разработчик
- [ ] Прочитал [RUN_LOCALLY.md](./RUN_LOCALLY.md)
- [ ] Запустил frontend
- [ ] Подключил к backend
- [ ] Протестировал функционал

### Тестировщик
- [ ] Регистрация работает
- [ ] Вход работает
- [ ] Просмотр объявлений работает
- [ ] Создание объявления работает
- [ ] Добавление в избранное работает
- [ ] Профиль работает

---

## 🎓 Обучающие материалы

- [React документация](https://react.dev)
- [React Router](https://reactrouter.com)
- [Spring Boot документация](https://spring.io/projects/spring-boot)
- [JWT Auth](https://jwt.io)
- [Axios](https://axios-http.com)

---

## 📞 Помощь и поддержка

Если вам нужна помощь:

1. Смотрите соответствующую документацию выше
2. Проверьте терминальные логи для ошибок
3. Посмотрите [EXAMPLES.md](./EXAMPLES.md) для примеров кода
4. Проверьте DevTools браузера (F12 → Network tab)

---

## 📝 Лицензия

MIT

---

## 🎉 Готово!

**Начните с [RUN_LOCALLY.md](./RUN_LOCALLY.md) и запустите приложение!**

```bash
# Terminal 1: Backend
cd path/to/spring/project
mvn spring-boot:run

# Terminal 2: Frontend
cd c:\Users\User\Desktop\intern_react\college
npm run dev

# Browser
http://localhost:5173
```

**Удачи! 🚀**
