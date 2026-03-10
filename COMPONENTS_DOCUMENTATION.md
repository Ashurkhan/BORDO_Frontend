# 📚 Документация компонентов Bordo

## Общая архитектура

Приложение построено на React 19 с использованием TypeScript, React Router для навигации и Context API для управления состоянием аутентификации.

---

## 🔐 Контекст аутентификации (`context/AuthContext.tsx`)

### Назначение
Глобальное управление состоянием пользователя и аутентификацией.

### Основной функционал
- Хранение информации текущего пользователя
- Управление токеном авторизации
- Методы login, register, logout
- Проверка аутентификации при загрузке приложения

### Интерфейс AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: UserRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

### Использование
```tsx
const { user, isAuthenticated, login, register, logout } = useAuth();
```

---

## 🌐 API сервис (`services/api.ts`)

### Назначение
Центральный axios инстанс для всех API запросов.

### Возможности
- Автоматическое добавление Bearer token в заголовки
- Обработка ошибок
- Базовый URL конфигурируется через .env

### Группы API методов

#### Auth API
```typescript
authAPI.register(data: UserRequest)          // Регистрация
authAPI.login(data: LoginRequest)             // Вход
authAPI.getCurrentUser()                      // Получить текущего пользователя
```

#### Ads API
```typescript
adsAPI.getAll(params)                         // Все объявления с фильтрацией
adsAPI.getById(id)                            // Получить объявление по ID
adsAPI.create(data: AdRequest)                // Создать новое
adsAPI.update(id, data: AdRequest)            // Обновить существующее
adsAPI.delete(id)                             // Удалить объявление
adsAPI.getByUserId(userId)                    // Объявления конкретного пользователя
```

#### Categories API
```typescript
categoriesAPI.getAll()                        // Все категории
categoriesAPI.getById(id)                     // Категория по ID
```

#### Locations API
```typescript
locationsAPI.getAll()                         // Все локации
locationsAPI.getById(id)                      // Локация по ID
```

#### Favorites API
```typescript
favoritesAPI.addFavorite(adId)                // Добавить в избранное
favoritesAPI.removeFavorite(adId)             // Удалить из избранного
favoritesAPI.getUserFavorites()               // Мои избранные
```

---

## 🧩 Компоненты

### Header.tsx
**Назначение:** Навигационный заголовок приложения

**Props:** Нет (использует useAuth и useNavigate)

**Функционал:**
- Логотип и название приложения
- Ссылки на основные разделы
- Отображение имени пользователя (если залогинен)
- Кнопки входа/регистрации (если не залогинен)
- Кнопка выхода (если залогинен)

**CSS классы:** `.header`, `.header-container`, `.logo`, `.nav-menu`, `.header-actions`

---

### Login.tsx
**Назначение:** Страница входа в систему

**Props:** Нет (использует useAuth и useNavigate)

**Состояние:**
- `email` - email пользователя
- `passwordHash` - пароль
- `error` - сообщение об ошибке
- `isLoading` - состояние загрузки

**Функционал:**
- Валидация email
- Запрос API для входа
- Сохранение токена и редирект
- Ссылка на регистрацию

**CSS классы:** `.auth-container`, `.auth-form`, `.form-group`, `.error-message`, `.submit-button`

---

### Register.tsx
**Назначение:** Страница регистрации новых пользователей

**Props:** Нет

**Состояние:**
- `formData` - данные формы (fullName, phone, email, passwordHash)
- `confirmPassword` - подтверждение пароля
- `error` - сообщение об ошибке
- `isLoading` - состояние загрузки

**Функционал:**
- Валидация всех полей
- Проверка совпадения паролей
- Проверка длины пароля (5-8 символов)
- Запрос API для регистрации
- Автоматический вход после успешной регистрации

**CSS классы:** `.auth-container`, `.auth-form`, `.form-group`, `.error-message`

---

### AdsList.tsx
**Назначение:** Главная страница с каталогом объявлений

**Props:** Нет

**Состояние:**
- `ads` - список объявлений
- `categories` - список категорий
- `selectedCategory` - выбранная категория для фильтрации
- `isLoading` - состояние загрузки
- `error` - сообщение об ошибке

**Функционал:**
- Загрузка категорий и объявлений при монтировании
- Фильтрация объявлений по выбранной категории
- Отображение сетки объявлений
- Клик на объявление открывает детали
- Доступна для всех (с аутентификацией и без)

**CSS классы:** `.ads-page`, `.ads-container`, `.ads-sidebar`, `.category-list`, `.ads-grid`, `.ad-card`

---

### AdDetails.tsx
**Назначение:** Детальная страница объявления

**Props:** 
- `id` - ID объявления из URL параметров

**Состояние:**
- `ad` - данные объявления
- `isLoading` - состояние загрузки
- `error` - сообщение об ошибке
- `isFavorite` - добавлено ли в избранное

**Функционал:**
- Загрузка деталей объявления
- Отображение полной информации о скоте
- Кнопка добавления в избранное
- Контакты продавца
- История просмотров
- Информация о локации

**CSS классы:** `.ad-details-page`, `.ad-details-container`, `.ad-image-placeholder-large`, `.favorite-button`, `.ad-seller-section`

---

### Profile.tsx
**Назначение:** Профиль пользователя с управлением объявлениями

**Props:** Нет

**Состояние:**
- `userAds` - список объявлений пользователя
- `isLoading` - состояние загрузки
- `activeTab` - активная вкладка (info или ads)

**Функционал:**
- Вкладка "Личная информация" - просмотр данных профиля
- Вкладка "Мои объявления" - управление объявлениями
- Удаление объявления с подтверждением
- Кнопка создания нового объявления
- Кнопка выхода из системы
- Статистика (количество объявлений)

**CSS классы:** `.profile-page`, `.profile-container`, `.profile-sidebar`, `.profile-tabs`, `.tab-content`, `.user-ads-table`

---

### Favorites.tsx
**Назначение:** Просмотр избранных объявлений

**Props:** Нет

**Состояние:**
- `favorites` - список избранных объявлений
- `isLoading` - состояние загрузки

**Функционал:**
- Загрузка избранных объявлений
- Отображение в виде сетки карточек
- Удаление из избранного
- Переход к полной информации об объявлении
- Редирект на логин если не авторизован

**CSS классы:** `.favorites-page`, `.favorites-header`, `.favorites-grid`, `.favorite-card`

---

### CreateAd.tsx
**Назначение:** Форма создания нового объявления

**Props:** Нет

**Состояние:**
- `formData` - данные объявления (AdRequest)
- `categories` - список доступных категорий
- `locations` - список доступных локаций
- `isLoading` - состояние загрузки
- `error` - сообщение об ошибке

**Функционал:**
- Загрузка категорий и локаций
- Валидация обязательных полей
- Отправка данных на сервер
- Редирект в профиль после успеха
- Возможность отмены и возврата в профиль

**Поля формы:**
- Название (обязательно)
- Описание (обязательно, текстовое поле)
- Категория (обязательно, выпадающий список)
- Локация (опционально, выпадающий список)
- Цена (обязательно, число)
- Валюта (RUB, USD, EUR)

**CSS классы:** `.create-ad-page`, `.create-ad-container`, `.form-group`, `.form-row`, `.submit-button`

---

## 📱 Типы данных (`types/index.ts`)

### User
```typescript
interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
}
```

### Ad
```typescript
interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: AdStatus;  // 'ACTIVE' | 'SOLD' | 'INACTIVE'
  views: AdView[];
  seller: User;
  category: Category;
  location: Location;
  favoritedBy: Favorite[];
  createdAt: string;
  updatedAt: string;
}
```

### AdRequest
```typescript
interface AdRequest {
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryID: number;
  locationID?: number;
}
```

### Category
```typescript
interface Category {
  id: number;
  name: string;
}
```

### Location
```typescript
interface Location {
  id: number;
  city: string;
  region: string;
}
```

---

## 🛣️ Маршруты (App.tsx)

| Маршрут | Компонент | Требует аутентификации | Описание |
|---------|-----------|----------------------|---------|
| `/` | AdsList | Нет | Каталог объявлений |
| `/login` | Login | Нет | Вход в систему |
| `/register` | Register | Нет | Регистрация |
| `/ads/:id` | AdDetails | Нет | Детали объявления |
| `/profile` | Profile | Да | Профиль пользователя |
| `/favorites` | Favorites | Да | Избранные объявления |
| `/ads/create` | CreateAd | Да | Создание объявления |

---

## 🎨 CSS структура

### Общие стили (`styles/index.css`)
- Сброс стилей по умолчанию
- Глобальные стили для body, input, button
- Общие классы `.loading`, `.error-message`, `.back-button`

### Цветовая схема
- Primary: `#667eea` - фиолетовый
- Secondary: `#764ba2` - пурпурный
- Text: `#333` - темный серый
- Light: `#f5f5f5` - светло-серый
- Error: `#c33` - красный

### Адаптивность
Все компоненты имеют media queries для мобильных устройств (max-width: 768px и 480px)

---

## 🔄 Поток данных

```
AuthContext
    ↓
    ├→ Header (использует useAuth)
    ├→ ProtectedRoute (проверяет isAuthenticated)
    │   ├→ Profile
    │   ├→ Favorites
    │   └→ CreateAd
    └→ Публичные страницы
        ├→ AdsList
        ├→ AdDetails
        ├→ Login
        └→ Register
```

---

## 🔌 Интеграция с API

### Примеры запросов

**Вход:**
```typescript
await authAPI.login({ email: 'user@example.com', passwordHash: '12345' })
// Возвращает: { token: 'jwt...', user: User }
```

**Создание объявления:**
```typescript
await adsAPI.create({
  title: 'Молочные коровы',
  description: 'Голштинская порода...',
  price: 50000,
  currency: 'RUB',
  categoryID: 1
})
```

**Добавление в избранное:**
```typescript
await favoritesAPI.addFavorite(5)
```

---

## 📝 Примечания разработчикам

1. **Обработка ошибок:** Все API запросы обрабатывают ошибки и выводят сообщения пользователю
2. **Loading states:** Все формы показывают состояние загрузки
3. **Валидация:** Базовая валидация на фронтенде + проверка на бэкенде
4. **localStorage:** Токен сохраняется в localStorage, пароли НЕ сохраняются
5. **CORS:** Убедитесь что бэкенд возвращает правильные CORS заголовки

---

**Документация завершена!** Для вопросов обратитесь к документации React, React Router и Axios.
