# 📖 Индекс документации Bordo

## Содержание

### 🚀 Быстрый старт
- **[QUICK_START.md](./QUICK_START.md)** - Начните отсюда!
  - Как запустить приложение
  - Основные страницы и функции
  - Быстрые ответы на часто задаваемые вопросы

### 📋 Полная документация
- **[BORDO_README.md](./BORDO_README.md)** - Всё об приложении
  - Описание функциональности
  - Технологический стек
  - Структура проекта
  - API Endpoints
  - Модели данных

### 🔌 Интеграция с Backend
- **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** - Для backend разработчиков
  - CORS конфигурация
  - Все требуемые API endpoints
  - Примеры запросов и ответов
  - JWT аутентификация
  - Тестирование и troubleshooting

### 🧩 Компоненты и архитектура
- **[COMPONENTS_DOCUMENTATION.md](./COMPONENTS_DOCUMENTATION.md)** - Для frontend разработчиков
  - Описание каждого компонента
  - Props, State, и функционал
  - API сервисы
  - Типы данных
  - Маршруты приложения
  - CSS структура

### ✅ Статус проекта
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Итоговая информация
  - Статистика проекта
  - Архитектура приложения
  - Чек-листы
  - Известные особенности
  - Следующие шаги

### 📝 Этот файл
- **[INDEX.md](./INDEX.md)** - Вы здесь!
  - Навигация по документации
  - Рекомендации по прочтению

---

## 📚 Рекомендуемый порядок чтения

### Если вы разработчик frontend
1. Начните с [QUICK_START.md](./QUICK_START.md)
2. Прочитайте [COMPONENTS_DOCUMENTATION.md](./COMPONENTS_DOCUMENTATION.md)
3. Посмотрите [BORDO_README.md](./BORDO_README.md) для деталей
4. Проверьте [PROJECT_STATUS.md](./PROJECT_STATUS.md) для архитектуры

### Если вы разработчик backend
1. Начните с [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
2. Посмотрите [BORDO_README.md](./BORDO_README.md) для понимания API
3. Проверьте [COMPONENTS_DOCUMENTATION.md](./COMPONENTS_DOCUMENTATION.md) для деталей

### Если вы менеджер проекта
1. Прочитайте [PROJECT_STATUS.md](./PROJECT_STATUS.md)
2. Посмотрите [QUICK_START.md](./QUICK_START.md)
3. Прочитайте [BORDO_README.md](./BORDO_README.md)

---

## 🎯 Быстрые ответы

### Как запустить?
→ [QUICK_START.md](./QUICK_START.md#начало-работы)

### Какие есть страницы?
→ [QUICK_START.md](./QUICK_START.md#основные-страницы-приложения)

### Какие API endpoints нужны?
→ [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md#-требуемые-endpoints)

### Как работает компонент X?
→ [COMPONENTS_DOCUMENTATION.md](./COMPONENTS_DOCUMENTATION.md#-компоненты)

### Какие технологии используются?
→ [BORDO_README.md](./BORDO_README.md#технологический-стек)

### Где находится компонент Y?
→ [BORDO_README.md](./BORDO_README.md#структура-проекта)

### Как интегрировать backend?
→ [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)

---

## 📁 Структура файлов проекта

```
college/
├── src/
│   ├── components/          # 8 React компонентов
│   ├── context/            # AuthContext.tsx
│   ├── services/           # api.ts для работы с backend
│   ├── styles/             # 8 CSS файлов (450+ строк стилей)
│   ├── types/              # TypeScript интерфейсы
│   ├── App.tsx             # Главный компонент с маршрутами
│   └── main.tsx            # Точка входа приложения
│
├── public/                 # Статические файлы
├── dist/                   # Production сборка (после npm run build)
│
├── .env                    # Конфигурация (API URL)
├── package.json            # Dependencies
├── vite.config.ts          # Vite конфигурация
├── tsconfig.json           # TypeScript конфигурация
│
└── Документация (5 файлов):
    ├── QUICK_START.md                    # 📖 Начните отсюда
    ├── BORDO_README.md                   # 📋 Полная документация
    ├── BACKEND_INTEGRATION.md            # 🔌 Интеграция backend
    ├── COMPONENTS_DOCUMENTATION.md       # 🧩 Компоненты
    ├── PROJECT_STATUS.md                 # ✅ Статус проекта
    └── INDEX.md (этот файл)             # Навигация
```

---

## 🔧 Основные команды

```bash
# Развитие
npm run dev        # Запустить dev сервер на http://localhost:5173

# Продакшн
npm run build      # Собрать проект в dist/
npm run preview    # Просмотреть production сборку

# Код качество
npm run lint       # Проверить код с ESLint
```

---

## 🌍 Внешние ресурсы

### Документация технологий
- [React 19 документация](https://react.dev)
- [React Router v6](https://reactrouter.com)
- [TypeScript справка](https://www.typescriptlang.org/docs)
- [Axios документация](https://axios-http.com)
- [Vite руководство](https://vitejs.dev)

### Spring Boot ресурсы
- [Spring Boot документация](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)

---

## 🆘 Помощь и поддержка

### Я встретил ошибку!

**Frontend ошибка?**
1. Проверьте browser console (F12)
2. Смотрите network tab для API ошибок
3. Прочитайте [QUICK_START.md - FAQ](./QUICK_START.md#часто-встречающиеся-вопросы)
4. Проверьте [PROJECT_STATUS.md - Troubleshooting](#)

**Backend ошибка?**
1. Смотрите Spring logs
2. Проверьте что endpoints реализованы согласно [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
3. Убедитесь что CORS настроен правильно

**CORS ошибка?**
1. Проверьте что backend запущен
2. Смотрите [BACKEND_INTEGRATION.md - CORS конфигурация](./BACKEND_INTEGRATION.md#1-cors-конфигурация)

---

## 📞 Контактная информация

Если у вас остались вопросы после прочтения документации:

- 📧 Смотрите README для контактных данных
- 🐛 Проверьте Issues в git репозитории
- 💬 Спросите в вашей команде разработки

---

## ✨ Подсказки по использованию документации

### Синий текст = ссылка на другой файл
Нажмите на него для перехода

### `код` = файл, функция или переменная
Посмотрите в исходном коде для примеров

### 📖 Иконки = типы документации
- 📖 Справочная информация
- 🚀 Начало работы
- 🔌 Интеграция
- 🧩 Компоненты
- ✅ Статус

---

## 📊 Быстрая статистика

| Метрика | Значение |
|---------|----------|
| Страниц | 7 |
| Компонентов | 8 |
| API endpoints | 20+ |
| CSS файлов | 8 |
| Строк кода | ~3900 |
| Размер сборки (JS) | 93 KB (gzipped) |
| Размер сборки (CSS) | 3.5 KB (gzipped) |
| Документация | 30+ KB |

---

**Спасибо за внимание! Удачи в разработке! 🚀**

---

*Последнее обновление: 26 января 2026*
